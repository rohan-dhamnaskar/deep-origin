import { getRedisClient } from "../connections/redis";

const PREFIX = "urlshortener:";
const EXPIRATION = 30 * 24 * 60 * 60; // 30 days in seconds (Redis expects seconds)

export const setItem = async (key: string, value: string): Promise<void> => {
  try {
    const client = getRedisClient();
    await client.set(`${PREFIX}${key}`, value, "EX", EXPIRATION);
  } catch (error) {
    console.error("Error storing in Redis:", error);
    throw error;
  }
};

export const getItem = async (key: string): Promise<string | null> => {
  try {
    const client = getRedisClient();
    return await client.get(`${PREFIX}${key}`);
  } catch (error) {
    console.error("Error retrieving from Redis:", error);
    throw error;
  }
};
