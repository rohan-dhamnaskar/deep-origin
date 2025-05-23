import { Client } from "@hapi/catbox";
import { Engine } from "@hapi/catbox-redis";

let catboxClient: Client<string> | null = null;
const SEGMENT = "urlshortener";
const EXPIRATION = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

export const initRedisClient = async (): Promise<Client<string>> => {
  try {
    // Pass the Engine constructor (not an instance) to the Client
    catboxClient = new Client<string>(Engine, {
      partition: "urlshortener",
    });

    await catboxClient.start();
    console.log("Redis connection established successfully");
    return catboxClient;
  } catch (err) {
    console.error("Failed to establish Redis connection:", err);
    throw err;
  }
};

export const getCatboxClient = (): Client<string> => {
  if (!catboxClient) {
    throw new Error("Catbox client not initialized");
  }
  return catboxClient;
};

export const setItem = async (key: string, value: string): Promise<void> => {
  const client = getCatboxClient();
  await client.set({ segment: SEGMENT, id: key }, value, EXPIRATION);
};

export const getItem = async (key: string): Promise<string | null> => {
  const client = getCatboxClient();
  const result = await client.get({ segment: SEGMENT, id: key });
  return result ? result.item : null;
};

export const closeRedisConnection = async (): Promise<void> => {
  if (catboxClient) {
    await catboxClient.stop();
    catboxClient = null;
  }
};
