import { getCatboxClient } from "../connections/redis";

const SEGMENT = "urlshortener";
const EXPIRATION = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

export const setItem = async (key: string, value: string): Promise<void> => {
  const client = getCatboxClient();
  await client.set({ segment: SEGMENT, id: key }, value, EXPIRATION);
};

export const getItem = async (key: string): Promise<string | null> => {
  const client = getCatboxClient();
  const result = await client.get({ segment: SEGMENT, id: key });
  return result ? result.item : null;
};
