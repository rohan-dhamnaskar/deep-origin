import crypto from "crypto";
import {
  setItem as setRedisItem,
  getItem as getRedisItem,
} from "../lib/urlShortenerRedis";
import {
  setItem as setPostgresItem,
  getItem as getPostgresItem,
  getAllItems as getAllPostgresItems,
  updateViewCount,
} from "../lib/urlShortenerModel";

interface ShortenedURL {
  original_url: string;
  short_code: string;
  user_Id?: string | null; // Optional user ID, can be null if not provided
  created_at?: Date;
}

/**
 * Shortens a given URL and stores it in Redis.
 * @param originalUrl The original URL to shorten.
 * @returns The shortened URL code.
 */
export const shortenUrl = async (
  originalUrl: string,
): Promise<ShortenedURL | null> => {
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

  return {
    original_url: originalUrl,
    short_code: shortCode,
    user_Id: null, // Assuming user ID is not provided, can be modified as needed
    created_at: new Date(), // Set current date as creation time
  };
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

  const views = await updateViewCount(shortCode);
  console.log("View count updated in PostgreSQL:", views);

  return cachedUrl;
};

export const getAllUrls = async (): Promise<ShortenedURL[] | null> => {
  const allUrls = (await getAllPostgresItems()) as ShortenedURL[] | null;

  if (!allUrls || allUrls.length === 0) {
    console.log("No URLs found in PostgreSQL");
    return null;
  }
  await regenerateRedisCache(allUrls);

  return allUrls;
};

const regenerateRedisCache = async (allUrls: ShortenedURL[]): Promise<void> => {
  if (!allUrls || allUrls.length === 0) {
    console.log("No URLs found in PostgreSQL, nothing to cache in Redis");
    return;
  }

  for (const url of allUrls) {
    const { short_code: shortCode, original_url: originalUrl } = url;
    await setRedisItem(shortCode, originalUrl);
  }
  console.log("Redis cache regenerated with all URLs from PostgreSQL");
};
