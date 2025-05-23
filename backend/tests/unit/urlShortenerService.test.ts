// backend/tests/unit/urlShortenerService.test.ts
import { shortenUrl, getOriginalUrl } from "../../src/services/urlShortener";
import * as urlShortenerModel from "../../src/lib/urlShortenerModel";
import * as urlShortenerRedis from "../../src/lib/urlShortenerRedis";

// Mock dependencies
jest.mock("../../src/lib/urlShortenerModel");
jest.mock("../../src/lib/urlShortenerRedis");

describe("urlShortenerService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("shortenUrl", () => {
    it("should generate a short code and store URL in both storage layers", async () => {
      const originalUrl = "https://example.com/very/long/path";
      const shortCode = "abc123";

      // Mock the short code generation
      jest.spyOn(global.Math, "random").mockReturnValue(0.1);

      // Mock model and Redis responses
      (urlShortenerModel.setItem as jest.Mock).mockResolvedValue(shortCode);
      (urlShortenerRedis.setItem as jest.Mock).mockResolvedValue(undefined);

      const result = await shortenUrl(originalUrl);

      expect(result).toBe(shortCode);
      expect(urlShortenerModel.setItem).toHaveBeenCalledWith(
        expect.any(String),
        originalUrl,
      );
      expect(urlShortenerRedis.setItem).toHaveBeenCalledWith(
        expect.any(String),
        originalUrl,
      );

      // Restore Math.random
      jest.spyOn(global.Math, "random").mockRestore();
    });
  });

  describe("getOriginalUrl", () => {
    it("should return URL from cache on cache hit", async () => {
      const shortCode = "abc123";
      const originalUrl = "https://example.com";

      (urlShortenerRedis.getItem as jest.Mock).mockResolvedValue(originalUrl);

      const result = await getOriginalUrl(shortCode);

      expect(result).toBe(originalUrl);
      expect(urlShortenerRedis.getItem).toHaveBeenCalledWith(shortCode);
      expect(urlShortenerModel.getItem).not.toHaveBeenCalled();
    });

    it("should fetch from DB and update cache on cache miss", async () => {
      const shortCode = "abc123";
      const originalUrl = "https://example.com";

      (urlShortenerRedis.getItem as jest.Mock).mockResolvedValue(null);
      (urlShortenerModel.getItem as jest.Mock).mockResolvedValue(originalUrl);

      const result = await getOriginalUrl(shortCode);

      expect(result).toBe(originalUrl);
      expect(urlShortenerRedis.getItem).toHaveBeenCalledWith(shortCode);
      expect(urlShortenerModel.getItem).toHaveBeenCalledWith(shortCode);
      expect(urlShortenerRedis.setItem).toHaveBeenCalledWith(
        shortCode,
        originalUrl,
      );
    });

    it("should return null if URL not found in either storage", async () => {
      (urlShortenerRedis.getItem as jest.Mock).mockResolvedValue(null);
      (urlShortenerModel.getItem as jest.Mock).mockResolvedValue(null);

      const result = await getOriginalUrl("nonexistent");

      expect(result).toBeNull();
    });
  });
});
