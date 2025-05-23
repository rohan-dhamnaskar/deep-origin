import crypto from "crypto";
import { setItem, getItem } from "../connections/redis";

/**
 * Shortens a given URL and stores it in Redis.
 * @param originalUrl The original URL to shorten.
 * @returns The shortened URL code.
 */
export const shortenUrl = async (originalUrl: string): Promise<string> => {
  // use MD5 for now
  const shortCode = crypto
    .createHash("md5")
    .update(originalUrl + Date.now())
    .digest("hex")
    .substring(0, 6);

  // save to redis for now
  await setItem(shortCode, originalUrl);

  return shortCode;
};

/**
 * Retrieves the original URL from the short code.
 * @param shortCode The short code to look up.
 * @returns The original URL or null if not found.
 */
export const getOriginalUrl = async (
  shortCode: string,
): Promise<string | null> => {
  return await getItem(shortCode);
};
