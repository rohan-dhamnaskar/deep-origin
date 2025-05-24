// backend/tests/unit/urlShortenerRedis.test.ts
import { setItem, getItem } from "../../src/lib/urlShortenerRedis";
import * as redis from "../../src/connections/redis";

// Mock the redis module
jest.mock("../../src/connections/redis");

describe("urlShortenerRedis", () => {
  let mockCatboxClient: any;
  const SEGMENT = "urlshortener";
  const EXPIRATION = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

  beforeEach(() => {
    // Create mock Catbox client methods
    mockCatboxClient = {
      set: jest.fn(),
      get: jest.fn(),
    };

    // Setup the mock implementation for getCatboxClient
    (redis.getCatboxClient as jest.Mock).mockReturnValue(mockCatboxClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("setItem", () => {
    it("should store a URL with expiration", async () => {
      mockCatboxClient.set.mockResolvedValue(undefined);

      await setItem("abc123", "https://example.com");

      expect(mockCatboxClient.set).toHaveBeenCalledWith(
        { segment: SEGMENT, id: "abc123" },
        "https://example.com",
        EXPIRATION,
      );
    });

    it("should handle errors when setting an item", async () => {
      mockCatboxClient.set.mockRejectedValue(new Error("Catbox error"));

      // Verify it doesn't throw but logs the error
      await expect(
        setItem("abc123", "https://example.com"),
      ).resolves.not.toThrow();
    });
  });

  describe("getItem", () => {
    it("should return item when it exists", async () => {
      mockCatboxClient.get.mockResolvedValue({
        item: "https://example.com",
        stored: Date.now(),
        ttl: 1000,
      });

      const result = await getItem("abc123");

      expect(result).toBe("https://example.com");
      expect(mockCatboxClient.get).toHaveBeenCalledWith({
        segment: SEGMENT,
        id: "abc123",
      });
    });

    it("should return null when item doesn't exist", async () => {
      mockCatboxClient.get.mockResolvedValue(null);

      const result = await getItem("abc123");

      expect(result).toBeNull();
    });

    it("should return null on error", async () => {
      mockCatboxClient.get.mockRejectedValue(new Error("Catbox error"));

      const result = await getItem("abc123");

      expect(result).toBeNull();
    });
  });
});
