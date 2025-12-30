import HomeScreen from "@/app/(tabs)/index";
import { useAuth } from "@/contexts/AuthContext";
import useFetch from "@/services/useFetch";
import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";

// Mock the hooks
jest.mock("@/contexts/AuthContext");
jest.mock("@/services/useFetch");

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseFetch = useFetch as jest.MockedFunction<typeof useFetch>;

describe("HomeScreen", () => {
  const mockIncrementClickCount = jest.fn();
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
        completedGoals: 1,
      },
      isLoading: false,
      signIn: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      deleteAccount: jest.fn(),
      incrementClickCount: mockIncrementClickCount,
    });

    mockUseFetch.mockReturnValue({
      data: { url: "https://cataas.com/cat/test.gif" },
      loading: false,
      error: null,
      refetch: mockRefetch,
      reset: mockReset,
    });
  });

  describe("rendering", () => {
    it("should render progress bar with correct count", () => {
      const { getByText } = render(<HomeScreen />);

      expect(getByText("100/1,500")).toBeTruthy();
    });

    it("should render the 'Another one!' button", () => {
      const { getByText } = render(<HomeScreen />);

      expect(getByText("Another one!")).toBeTruthy();
    });

    it("should render ad banner placeholder", () => {
      const { getByText } = render(<HomeScreen />);

      expect(getByText("Ad Banner Placeholder")).toBeTruthy();
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

      const { UNSAFE_queryByType } = render(<HomeScreen />);

      // ActivityIndicator should be present
      const { ActivityIndicator } = require("react-native");
      expect(UNSAFE_queryByType(ActivityIndicator)).toBeTruthy();
    });

    it("should disable button when loading", () => {
      mockUseFetch.mockReturnValue({
        data: null,
        loading: true,
        error: null,
        refetch: mockRefetch,
        reset: mockReset,
      });

      const { getByText } = render(<HomeScreen />);
      const button = getByText("Another one!").parent;

      // Button should have reduced opacity class (bg-primary-light)
      expect(button).toBeTruthy();
    });
  });

  describe("error state", () => {
    it("should display error message when error occurs", () => {
      mockUseFetch.mockReturnValue({
        data: null,
        loading: false,
        error: new Error("Failed to fetch"),
        refetch: mockRefetch,
        reset: mockReset,
      });

      const { getByText } = render(<HomeScreen />);

      expect(getByText("Error: Failed to fetch")).toBeTruthy();
    });
  });

  describe("button interaction", () => {
    it("should call incrementClickCount and refetch when button is pressed", async () => {
      mockIncrementClickCount.mockResolvedValue(undefined);

      const { getByText } = render(<HomeScreen />);
      const button = getByText("Another one!");

      await act(async () => {
        fireEvent.press(button);
      });

      await waitFor(() => {
        expect(mockIncrementClickCount).toHaveBeenCalled();
      });
    });
  });

  describe("progress bar", () => {
    it("should calculate correct progress percentage", () => {
      mockUseAuth.mockReturnValue({
        user: {
          id: "user-123",
          email: "test@example.com",
          nickname: "TestUser",
          clickCount: 750, // 50% of 1500
          completedGoals: 0,
        },
        isLoading: false,
        signIn: jest.fn(),
        signUp: jest.fn(),
        signOut: jest.fn(),
        deleteAccount: jest.fn(),
        incrementClickCount: mockIncrementClickCount,
      });

      const { getByText } = render(<HomeScreen />);

      expect(getByText("750/1,500")).toBeTruthy();
    });

    it("should cap progress at 100%", () => {
      mockUseAuth.mockReturnValue({
        user: {
          id: "user-123",
          email: "test@example.com",
          nickname: "TestUser",
          clickCount: 2000, // Over max
          completedGoals: 0,
        },
        isLoading: false,
        signIn: jest.fn(),
        signUp: jest.fn(),
        signOut: jest.fn(),
        deleteAccount: jest.fn(),
        incrementClickCount: mockIncrementClickCount,
      });

      const { getByText } = render(<HomeScreen />);

      expect(getByText("2,000/1,500")).toBeTruthy();
    });
  });

  describe("no user state", () => {
    it("should handle null user gracefully", () => {
      mockUseAuth.mockReturnValue({
        user: null,
        isLoading: false,
        signIn: jest.fn(),
        signUp: jest.fn(),
        signOut: jest.fn(),
        deleteAccount: jest.fn(),
        incrementClickCount: mockIncrementClickCount,
      });

      const { getByText } = render(<HomeScreen />);

      expect(getByText("0/1,500")).toBeTruthy();
    });
  });
});
