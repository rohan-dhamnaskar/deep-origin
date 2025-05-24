import { getCatboxClient } from "../connections/redis";

const SEGMENT = "urlshortener";
const EXPIRATION = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

export const setItem = async (key: string, value: string): Promise<void> => {
  try {
    const client = getCatboxClient();
    await client.set({ segment: SEGMENT, id: key }, value, EXPIRATION);
  } catch (error) {
    console.error("Error storing in Redis:", error);
  }
};

export const getItem = async (key: string): Promise<string | null> => {
  try {
    const client = getCatboxClient();
    const result = await client.get({ segment: SEGMENT, id: key });
    return result ? result.item : null;
  } catch (error) {
    console.error("Error retrieving from Redis:", error);
    return null;
  }
};
