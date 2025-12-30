import useFetch from "@/services/useFetch";
import { act, renderHook, waitFor } from "@testing-library/react-native";

describe("useFetch", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("auto fetch", () => {
    it("should fetch data automatically when autoFetch is true (default)", async () => {
      const mockData = { id: 1, name: "Test" };
      const mockFetchFn = jest.fn().mockResolvedValue(mockData);

      const { result } = renderHook(() => useFetch(mockFetchFn));

      expect(result.current.loading).toBe(true);
      expect(result.current.data).toBeNull();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockFetchFn).toHaveBeenCalledTimes(1);
      expect(result.current.data).toEqual(mockData);
      expect(result.current.error).toBeNull();
    });

    it("should not fetch data when autoFetch is false", async () => {
      const mockFetchFn = jest.fn().mockResolvedValue({ id: 1 });

      const { result } = renderHook(() => useFetch(mockFetchFn, false));

      expect(result.current.loading).toBe(false);
      expect(result.current.data).toBeNull();
      expect(mockFetchFn).not.toHaveBeenCalled();
    });
  });

  describe("loading state", () => {
    it("should set loading to true while fetching", async () => {
      let resolvePromise: (value: { id: number }) => void;
      const mockFetchFn = jest.fn(
        () =>
          new Promise<{ id: number }>((resolve) => {
            resolvePromise = resolve;
          }),
      );

      const { result } = renderHook(() => useFetch(mockFetchFn));

      expect(result.current.loading).toBe(true);

      await act(async () => {
        resolvePromise!({ id: 1 });
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe("error handling", () => {
    it("should set error when fetch fails", async () => {
      const mockError = new Error("Network error");
      const mockFetchFn = jest.fn().mockRejectedValue(mockError);

      const { result } = renderHook(() => useFetch(mockFetchFn));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toEqual(mockError);
      expect(result.current.data).toBeNull();
    });

    it("should convert non-Error exceptions to Error objects", async () => {
      const mockFetchFn = jest.fn().mockRejectedValue("String error");

      const { result } = renderHook(() => useFetch(mockFetchFn));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe("An unknown error occurred");
    });
  });

  describe("refetch", () => {
    it("should refetch data when refetch is called", async () => {
      const mockData1 = { id: 1, name: "First" };
      const mockData2 = { id: 2, name: "Second" };
      const mockFetchFn = jest
        .fn()
        .mockResolvedValueOnce(mockData1)
        .mockResolvedValueOnce(mockData2);

      const { result } = renderHook(() => useFetch(mockFetchFn));

      await waitFor(() => {
        expect(result.current.data).toEqual(mockData1);
      });

      await act(async () => {
        result.current.refetch();
      });

      await waitFor(() => {
        expect(result.current.data).toEqual(mockData2);
      });

      expect(mockFetchFn).toHaveBeenCalledTimes(2);
    });

    it("should clear previous error on successful refetch", async () => {
      const mockFetchFn = jest
        .fn()
        .mockRejectedValueOnce(new Error("First error"))
        .mockResolvedValueOnce({ id: 1 });

      const { result } = renderHook(() => useFetch(mockFetchFn));

      await waitFor(() => {
        expect(result.current.error).not.toBeNull();
      });

      await act(async () => {
        result.current.refetch();
      });

      await waitFor(() => {
        expect(result.current.error).toBeNull();
      });

      expect(result.current.data).toEqual({ id: 1 });
    });
  });

  describe("reset", () => {
    it("should reset all state to initial values", async () => {
      const mockData = { id: 1, name: "Test" };
      const mockFetchFn = jest.fn().mockResolvedValue(mockData);

      const { result } = renderHook(() => useFetch(mockFetchFn));

      await waitFor(() => {
        expect(result.current.data).toEqual(mockData);
      });

      act(() => {
        result.current.reset();
      });

      expect(result.current.data).toBeNull();
      expect(result.current.error).toBeNull();
      expect(result.current.loading).toBe(false);
    });
  });

  describe("conditional fetching", () => {
    it("should fetch when autoFetch changes from false to true", async () => {
      const mockData = { id: 1 };
      const mockFetchFn = jest.fn().mockResolvedValue(mockData);

      const { result, rerender } = renderHook<
        ReturnType<typeof useFetch>,
        { autoFetch: boolean }
      >(({ autoFetch }) => useFetch(mockFetchFn, autoFetch), {
        initialProps: { autoFetch: false },
      });

      expect(mockFetchFn).not.toHaveBeenCalled();

      rerender({ autoFetch: true });

      await waitFor(() => {
        expect(result.current.data).toEqual(mockData);
      });

      expect(mockFetchFn).toHaveBeenCalledTimes(1);
    });
  });
});
