// backend/tests/unit/urlShortenerRedis.test.ts
import {
  setItem,
  getItem,
  // deleteItem,
  getAllKeys,
} from "../../src/lib/urlShortenerRedis";
import * as redis from "../../src/connections/redis";

// Mock the redis module
jest.mock("../../src/connections/redis");

describe("urlShortenerRedis", () => {
  let mockRedisClient: any;

  beforeEach(() => {
    // Create mock implementations for Redis commands
    mockRedisClient = {
      set: jest.fn(),
      get: jest.fn(),
      del: jest.fn(),
      scan: jest.fn(),
    };

    // Setup the mock implementation for getRedisClient
    (redis.getRedisClient as jest.Mock).mockReturnValue(mockRedisClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("setItem", () => {
    it("should store a URL mapping in Redis", async () => {
      mockRedisClient.set.mockResolvedValue("OK");

      await setItem("abc123", "https://example.com");

      expect(mockRedisClient.set).toHaveBeenCalledWith(
        "urlshortener:abc123",
        "https://example.com",
        "EX",
        expect.any(Number), // Redis expects expiration in seconds
      );
    });

    it("should handle Redis errors gracefully", async () => {
      const redisError = new Error("Redis connection error");
      mockRedisClient.set.mockRejectedValue(redisError);

      await expect(
        setItem("abc123", "https://example.com"),
      ).resolves.not.toThrow();
    });
  });

  describe("getItem", () => {
    it("should retrieve a URL for an existing short code", async () => {
      mockRedisClient.get.mockResolvedValue("https://example.com");

      const result = await getItem("abc123");

      expect(result).toBe("https://example.com");
    });

    it("should return null for a non-existent short code", async () => {
      mockRedisClient.get.mockResolvedValue(null);

      const result = await getItem("nonexistent");

      expect(result).toBeNull();
    });

    it("should handle Redis errors and return null", async () => {
      mockRedisClient.get.mockRejectedValue(new Error("Redis error"));

      const result = await getItem("abc123");

      expect(result).toBeNull();
    });
  });

  /*describe("deleteItem", () => {
    it("should delete a URL mapping and return true on success", async () => {
      mockRedisClient.del.mockResolvedValue(1);

      const result = await deleteItem("abc123");

      expect(result).toBe(true);
      expect(mockRedisClient.del).toHaveBeenCalledWith("url:abc123");
    });

    it("should return false when no item is deleted", async () => {
      mockRedisClient.del.mockResolvedValue(0);

      const result = await deleteItem("nonexistent");

      expect(result).toBe(false);
      expect(mockRedisClient.del).toHaveBeenCalled();
    });

    it("should handle Redis errors and return false", async () => {
      mockRedisClient.del.mockRejectedValue(new Error("Redis error"));

      const result = await deleteItem("abc123");

      expect(result).toBe(false);
      expect(mockRedisClient.del).toHaveBeenCalled();
    });
  });*/

  describe("getAllKeys", () => {
    it("should retrieve all URL keys from Redis", async () => {
      // Mock the Redis scan response format [nextCursor, keys]
      mockRedisClient.scan
        .mockResolvedValueOnce([
          "10",
          ["urlshortener:abc123", "urlshortener:def456"],
        ])
        .mockResolvedValueOnce(["0", ["urlshortener:ghi789"]]);

      const result = await getAllKeys();

      expect(result).toEqual([
        "urlshortener:abc123",
        "urlshortener:def456",
        "urlshortener:ghi789",
      ]);
    });

    it("should handle empty result sets", async () => {
      mockRedisClient.scan.mockResolvedValueOnce(["0", []]);

      const result = await getAllKeys();

      expect(result).toEqual([]);
    });

    it("should handle Redis errors and return null", async () => {
      mockRedisClient.scan.mockRejectedValue(new Error("Redis error"));

      const result = await getAllKeys();

      expect(result).toBeNull();
    });
  });
});
