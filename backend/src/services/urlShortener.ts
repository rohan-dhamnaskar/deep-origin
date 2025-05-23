import crypto from "crypto";
import {
  setItem as setRedisItem,
  getItem as getRedisItem,
} from "../lib/urlShortenerRedis";
import {
  setItem as setPostgresItem,
  getItem as getPostgresItem,
} from "../lib/urlShortenerModel";

/**
 * Shortens a given URL and stores it in Redis.
 * @param originalUrl The original URL to shorten.
 * @returns The shortened URL code.
 */
export const shortenUrl = async (
  originalUrl: string,
): Promise<string | null> => {
  // use MD5 for now
  const shortCode = crypto
    .createHash("md5")
    .update(originalUrl + Date.now())
    .digest("hex")
    .substring(0, 6);

  const savedShortCode = await setPostgresItem(shortCode, originalUrl);
  if (!savedShortCode) {
    const message = `Short code ${shortCode} already exists in PostgreSQL`;
    console.error(message);
    throw new Error(message);
  } else {
    await setRedisItem(shortCode, originalUrl);
  }

  return savedShortCode;
};

/**
 * Retrieves the original URL from the short code.
 * @param shortCode The short code to look up.
 * @returns The original URL or null if not found.
 */
export const getOriginalUrl = async (
  shortCode: string,
): Promise<string | null> => {
  // Check Redis first
  const cachedUrl = await getRedisItem(shortCode);
  if (cachedUrl) {
    console.log("Cache hit in Redis");
    return cachedUrl;
  }

  if (!cachedUrl) {
    // If not found in Redis, check PostgreSQL
    const originalUrl = await getPostgresItem(shortCode);

    if (originalUrl) {
      // Cache the result in Redis for future requests
      await setRedisItem(shortCode, originalUrl);
    }

    return originalUrl;
  }

  return cachedUrl;
};
