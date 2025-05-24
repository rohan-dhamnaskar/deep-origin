import Redis from "ioredis";

let redisClient: Redis | null = null;

export const initRedisClient = async (): Promise<Redis> => {
  try {
    redisClient = new Redis({
      host: process.env.REDIS_HOST || "redis",
      port: parseInt(process.env.REDIS_PORT || "6379"),
      db: 0,
      keyPrefix: "urlshortener:",
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });

    // Test the connection
    await redisClient.ping();
    console.log("Redis connection established successfully");
    return redisClient;
  } catch (err) {
    console.error("Failed to establish Redis connection:", err);
    throw err;
  }
};

export const getRedisClient = (): Redis => {
  if (!redisClient) {
    throw new Error("Redis client not initialized");
  }
  return redisClient;
};

export const getCatboxClient = (): Redis => {
  return getRedisClient();
};

export const closeRedisConnection = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
};
