import TreesScreen from "@/app/(tabs)/trees";
import { useAuth } from "@/contexts/AuthContext";
import useFetch from "@/services/useFetch";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";

// Mock the hooks
jest.mock("@/contexts/AuthContext");
jest.mock("@/services/useFetch");

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseFetch = useFetch as jest.MockedFunction<typeof useFetch>;

describe("TreesScreen", () => {
  const mockRefetch = jest.fn();
  const mockReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseAuth.mockReturnValue({
      user: {
        id: "user-123",
        email: "test@example.com",
        nickname: "TestUser",
        clickCount: 100,
        completedGoals: 2,
      },
      isLoading: false,
      signIn: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      deleteAccount: jest.fn(),
      incrementClickCount: jest.fn(),
    });
  });

  describe("rendering", () => {
    it("should render header", () => {
      mockUseFetch.mockReturnValue({
        data: null,
        loading: false,
        error: null,
        refetch: mockRefetch,
        reset: mockReset,
      });

      const { getByText } = render(<TreesScreen />);

      expect(getByText("Trees planted by you")).toBeTruthy();
    });

    it("should render ad banner placeholder", () => {
      mockUseFetch.mockReturnValue({
        data: null,
        loading: false,
        error: null,
        refetch: mockRefetch,
        reset: mockReset,
      });

      const { getByText } = render(<TreesScreen />);

      expect(getByText("Ad Banner Placeholder")).toBeTruthy();
    });
  });

  describe("no trees state", () => {
    it("should show empty state when no data", () => {
      mockUseFetch.mockReturnValue({
        data: null,
        loading: false,
        error: null,
        refetch: mockRefetch,
        reset: mockReset,
      });

      const { getByText } = render(<TreesScreen />);

      expect(getByText("No trees planted yet, keep clicking!")).toBeTruthy();
      expect(getByText("🌲")).toBeTruthy();
    });

    it("should not fetch when completedGoals is 0", () => {
      mockUseAuth.mockReturnValue({
        user: {
          id: "user-123",
          email: "test@example.com",
          nickname: "TestUser",
          clickCount: 100,
          completedGoals: 0,
        },
        isLoading: false,
        signIn: jest.fn(),
        signUp: jest.fn(),
        signOut: jest.fn(),
        deleteAccount: jest.fn(),
        incrementClickCount: jest.fn(),
      });

      mockUseFetch.mockReturnValue({
        data: null,
        loading: false,
        error: null,
        refetch: mockRefetch,
        reset: mockReset,
      });

      render(<TreesScreen />);

      // useFetch should be called with autoFetch = false (completedGoals > 0 is false)
      expect(mockUseFetch).toHaveBeenCalledWith(expect.any(Function), false);
    });
  });

  describe("loading state", () => {
    it("should show loading indicator when loading", () => {
      mockUseFetch.mockReturnValue({
        data: null,
        loading: true,
        error: null,
        refetch: mockRefetch,
        reset: mockReset,
      });

      const { UNSAFE_queryByType } = render(<TreesScreen />);

      const { ActivityIndicator } = require("react-native");
      expect(UNSAFE_queryByType(ActivityIndicator)).toBeTruthy();
    });
  });

  describe("error state", () => {
    it("should display error message when error occurs", () => {
      mockUseFetch.mockReturnValue({
        data: null,
        loading: false,
        error: new Error("Failed to fetch trees"),
        refetch: mockRefetch,
        reset: mockReset,
      });

      const { getByText } = render(<TreesScreen />);

      expect(getByText("Error: Failed to fetch trees")).toBeTruthy();
    });
  });

  describe("trees list", () => {
    const mockTreesData = {
      data: [
        {
          id: 1,
          common_name: "Oak",
          status: "accepted",
          image_url: "https://example.com/oak.jpg",
          family: "Fagaceae",
          genus: "Quercus",
        },
        {
          id: 2,
          common_name: "Pine",
          status: "accepted",
          image_url: "https://example.com/pine.jpg",
          family: "Pinaceae",
          genus: "Pinus",
        },
      ],
    };

    it("should render trees list", () => {
      mockUseFetch.mockReturnValue({
        data: mockTreesData,
        loading: false,
        error: null,
        refetch: mockRefetch,
        reset: mockReset,
      });

      const { getByText } = render(<TreesScreen />);

      expect(getByText("Oak")).toBeTruthy();
      expect(getByText("Pine")).toBeTruthy();
    });

    it("should show correct plural for multiple trees", () => {
      mockUseFetch.mockReturnValue({
        data: mockTreesData,
        loading: false,
        error: null,
        refetch: mockRefetch,
        reset: mockReset,
      });

      const { getByText } = render(<TreesScreen />);

      expect(getByText(/You planted 2 trees/)).toBeTruthy();
    });

    it("should show correct singular for one tree", () => {
      mockUseFetch.mockReturnValue({
        data: {
          data: [
            {
              id: 1,
              common_name: "Oak",
              status: "accepted",
              image_url: null,
              family: "Fagaceae",
              genus: "Quercus",
            },
          ],
        },
        loading: false,
        error: null,
        refetch: mockRefetch,
        reset: mockReset,
      });

      const { getByText } = render(<TreesScreen />);

      expect(getByText(/You planted 1 tree/)).toBeTruthy();
    });

    it("should display tree status", () => {
      mockUseFetch.mockReturnValue({
        data: mockTreesData,
        loading: false,
        error: null,
        refetch: mockRefetch,
        reset: mockReset,
      });

      const { getAllByText } = render(<TreesScreen />);

      expect(getAllByText("accepted").length).toBe(2);
    });
  });

  describe("modal", () => {
    const mockTreesData = {
      data: [
        {
          id: 12345,
          common_name: "Oak",
          status: "accepted",
          image_url: "https://example.com/oak.jpg",
          family: "Fagaceae",
          genus: "Quercus",
        },
      ],
    };

    it("should open modal when tree is pressed", async () => {
      mockUseFetch.mockReturnValue({
        data: mockTreesData,
        loading: false,
        error: null,
        refetch: mockRefetch,
        reset: mockReset,
      });

      const { getByText, queryByText } = render(<TreesScreen />);

      // Modal content should not be visible initially
      expect(queryByText("Tree Details")).toBeNull();

      // Press on the tree
      fireEvent.press(getByText("Oak"));

      // Modal should now be visible
      await waitFor(() => {
        expect(getByText("Tree Details")).toBeTruthy();
      });
    });

    it("should display tree details in modal", async () => {
      mockUseFetch.mockReturnValue({
        data: mockTreesData,
        loading: false,
        error: null,
        refetch: mockRefetch,
        reset: mockReset,
      });

      const { getByText } = render(<TreesScreen />);

      fireEvent.press(getByText("Oak"));

      await waitFor(() => {
        expect(getByText("Tree ID")).toBeTruthy();
        expect(getByText("#12345")).toBeTruthy();
        expect(getByText("Common Name")).toBeTruthy();
        expect(getByText("Family")).toBeTruthy();
        expect(getByText("Fagaceae")).toBeTruthy();
        expect(getByText("Genus")).toBeTruthy();
        expect(getByText("Quercus")).toBeTruthy();
      });
    });

    it("should close modal when close button is pressed", async () => {
      mockUseFetch.mockReturnValue({
        data: mockTreesData,
        loading: false,
        error: null,
        refetch: mockRefetch,
        reset: mockReset,
      });

      const { getByText, queryByText } = render(<TreesScreen />);

      fireEvent.press(getByText("Oak"));

      await waitFor(() => {
        expect(getByText("Tree Details")).toBeTruthy();
      });

      // Press the Close button
      fireEvent.press(getByText("Close"));

      await waitFor(() => {
        expect(queryByText("Tree Details")).toBeNull();
      });
    });

    it("should close modal when X button is pressed", async () => {
      mockUseFetch.mockReturnValue({
        data: mockTreesData,
        loading: false,
        error: null,
        refetch: mockRefetch,
        reset: mockReset,
      });

      const { getByText, queryByText } = render(<TreesScreen />);

      fireEvent.press(getByText("Oak"));

      await waitFor(() => {
        expect(getByText("Tree Details")).toBeTruthy();
      });

      // Press the X button
      fireEvent.press(getByText("✕"));

      await waitFor(() => {
        expect(queryByText("Tree Details")).toBeNull();
      });
    });
  });
});
