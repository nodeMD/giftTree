import { fetchCatGif, fetchTreeData } from "@/services/api";

// Mock fetch globally
global.fetch = jest.fn();

describe("API Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchCatGif", () => {
    it("should fetch and return cat gif data", async () => {
      const mockResponse = { url: "https://cataas.com/cat/gif123" };
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await fetchCatGif();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: "GET",
          headers: expect.objectContaining({
            accept: "application/json",
          }),
        }),
      );
      expect(result).toEqual(mockResponse);
    });

    it("should throw error when response is not ok", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        statusText: "Not Found",
      });

      await expect(fetchCatGif()).rejects.toThrow(
        "Network response was not ok",
      );
    });

    it("should throw error when fetch fails", async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

      await expect(fetchCatGif()).rejects.toThrow("Network error");
    });
  });

  describe("fetchTreeData", () => {
    it("should fetch tree data with query and limit", async () => {
      const mockResponse = {
        data: [
          {
            id: 1,
            common_name: "Oak",
            status: "accepted",
            family: "Fagaceae",
            genus: "Quercus",
          },
        ],
      };
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await fetchTreeData("oak", 5);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("q=oak"),
        expect.any(Object),
      );
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("limit=5"),
        expect.any(Object),
      );
      expect(result).toEqual(mockResponse);
    });

    it("should handle zero limit", async () => {
      const mockResponse = { data: [] };
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await fetchTreeData("tree", 0);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("limit=0"),
        expect.any(Object),
      );
      expect(result).toEqual(mockResponse);
    });

    it("should throw error when response is not ok", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        statusText: "Server Error",
      });

      await expect(fetchTreeData("tree", 1)).rejects.toThrow(
        "Network response was not ok",
      );
    });

    it("should use correct headers", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ data: [] }),
      });

      await fetchTreeData("pine", 3);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: "GET",
          headers: expect.objectContaining({
            accept: "application/json",
          }),
        }),
      );
    });
  });
});
