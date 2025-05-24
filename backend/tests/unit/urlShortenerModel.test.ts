// backend/tests/unit/urlShortenerModel.test.ts
import {
  setItem,
  getItem,
  getAllItems,
  deleteItem,
} from "../../src/lib/urlShortenerModel";
import * as postgres from "../../src/connections/postgres";

// Mock the postgres module
jest.mock("../../src/connections/postgres");

describe("urlShortenerModel", () => {
  let queryMock: jest.Mock;

  beforeEach(() => {
    // Create a mock function for query
    queryMock = jest.fn();

    // Setup the mock implementation for getPostgresClient
    (postgres.getPostgresClient as jest.Mock).mockReturnValue({
      query: queryMock,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("setItem", () => {
    it("should insert a new URL mapping", async () => {
      // Check if exists - no rows
      queryMock.mockResolvedValueOnce({ rows: [], rowCount: 0 });
      // Insert - success
      queryMock.mockResolvedValueOnce({ rowCount: 1 });

      const result = await setItem("abc123", "https://example.com");

      expect(result).toBe("abc123");
      expect(queryMock).toHaveBeenCalledTimes(2);
    });

    it("should return null if short code already exists", async () => {
      queryMock.mockResolvedValue({
        rows: [{ short_code: "abc123", original_url: "https://example.com" }],
        rowCount: 1,
      });

      const result = await setItem("abc123", "https://example.com");

      expect(result).toBeNull();
    });
  });

  describe("getItem", () => {
    it("should return URL for existing short code", async () => {
      queryMock.mockResolvedValue({
        rows: [{ original_url: "https://example.com" }],
      });

      const result = await getItem("abc123");

      expect(result).toBe("https://example.com");
    });

    it("should return null for non-existent short code", async () => {
      queryMock.mockResolvedValue({ rows: [] });

      const result = await getItem("abc123");

      expect(result).toBeNull();
    });
  });

  // Additional tests for getAllItems and deleteItem would go here
  describe("getAllItems", () => {
    it("should return all URL mappings", async () => {
      queryMock.mockResolvedValue({
        rows: [
          { short_code: "abc123", original_url: "https://example.com" },
          { short_code: "def456", original_url: "https://another.com" },
        ],
      });

      const result = await getAllItems();

      expect(result).toHaveLength(2);
      expect(result[0].short_code).toBe("abc123");
      expect(result[1].original_url).toBe("https://another.com");
    });
  });

  describe("deleteItem", () => {
    it("should delete URL mapping and return true on success", async () => {
      queryMock.mockResolvedValue({ rowCount: 1 });

      const result = await deleteItem("abc123");

      expect(result).toBe(true);
      expect(queryMock).toHaveBeenCalledWith(
        expect.stringContaining("DELETE"),
        ["abc123"],
      );
    });

    it("should return false when no item is deleted", async () => {
      queryMock.mockResolvedValue({ rowCount: 0 });

      const result = await deleteItem("nonexistent");

      expect(result).toBe(false);
    });
  });
});
