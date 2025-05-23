import { Client } from "@hapi/catbox";
import { Engine } from "@hapi/catbox-redis";

let catboxClient: Client<string> | null = null;

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

export const closeRedisConnection = async (): Promise<void> => {
  if (catboxClient) {
    await catboxClient.stop();
    catboxClient = null;
  }
};
