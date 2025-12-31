import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import * as appwrite from "@/services/appwrite";
import { act, renderHook, waitFor } from "@testing-library/react-native";

// Mock the appwrite service
jest.mock("@/services/appwrite", () => ({
  signIn: jest.fn(),
  signOut: jest.fn(),
  createUser: jest.fn(),
  getCurrentUser: jest.fn(),
  getUserProfile: jest.fn(),
  updateUserProgress: jest.fn(),
  deleteAccount: jest.fn(),
}));

const mockAppwrite = appwrite as jest.Mocked<typeof appwrite>;

describe("AuthContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default: no user logged in
    mockAppwrite.getCurrentUser.mockResolvedValue(null);
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  describe("initial state", () => {
    it("should start with null user and loading state", async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      // Initially loading
      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();
    });

    it("should load existing user on mount", async () => {
      mockAppwrite.getCurrentUser.mockResolvedValue({
        $id: "user-123",
        email: "test@example.com",
        name: "Test User",
      });
      mockAppwrite.getUserProfile.mockResolvedValue({
        $sequence: 1,
        $tableId: "user-profiles",
        $databaseId: "main",
        $permissions: [],
        $id: "user-123",
        nickName: "TestNick",
        email: "test@example.com",
        clickCount: 100,
        completedGoals: 2,
        $createdAt: "",
        $updatedAt: "",
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toEqual({
        id: "user-123",
        email: "test@example.com",
        nickname: "TestNick",
        clickCount: 100,
        completedGoals: 2,
      });
    });
  });

  describe("signIn", () => {
    it("should sign in user and update state", async () => {
      mockAppwrite.signIn.mockResolvedValue({
        $id: "user-123",
        email: "test@example.com",
        name: "Test User",
      });
      mockAppwrite.getUserProfile.mockResolvedValue({
        $sequence: 1,
        $tableId: "user-profiles",
        $databaseId: "main",
        $permissions: [],
        $id: "user-123",
        nickName: "TestNick",
        email: "test@example.com",
        clickCount: 50,
        completedGoals: 1,
        $createdAt: "",
        $updatedAt: "",
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.signIn("test@example.com", "password123");
      });

      expect(mockAppwrite.signIn).toHaveBeenCalledWith(
        "test@example.com",
        "password123",
      );
      expect(result.current.user).toEqual({
        id: "user-123",
        email: "test@example.com",
        nickname: "TestNick",
        clickCount: 50,
        completedGoals: 1,
      });
    });

    it("should throw error on failed sign in", async () => {
      mockAppwrite.signIn.mockRejectedValue(new Error("Invalid credentials"));

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await expect(
        act(async () => {
          await result.current.signIn("test@example.com", "wrongpassword");
        }),
      ).rejects.toThrow("Invalid credentials");
    });
  });

  describe("signUp", () => {
    it("should create new user and update state", async () => {
      mockAppwrite.createUser.mockResolvedValue({
        $id: "new-user-123",
        $sequence: 1,
        $tableId: "user-profiles",
        $databaseId: "main",
        $permissions: [],
        nickName: "NewUser",
        email: "new@example.com",
        $createdAt: "",
        $updatedAt: "",
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.signUp(
          "new@example.com",
          "password123",
          "NewUser",
        );
      });

      expect(mockAppwrite.createUser).toHaveBeenCalledWith(
        "new@example.com",
        "password123",
        "NewUser",
      );
      expect(result.current.user).toEqual({
        id: "new-user-123",
        email: "new@example.com",
        nickname: "NewUser",
        clickCount: 0,
        completedGoals: 0,
      });
    });
  });

  describe("signOut", () => {
    it("should sign out user and clear state", async () => {
      // Start with logged in user
      mockAppwrite.getCurrentUser.mockResolvedValue({
        $id: "user-123",
        email: "test@example.com",
        name: "Test User",
      });
      mockAppwrite.getUserProfile.mockResolvedValue({
        $id: "user-123",
        $sequence: 1,
        $tableId: "user-profiles",
        $databaseId: "main",
        $permissions: [],
        nickName: "TestNick",
        email: "test@example.com",
        clickCount: 100,
        completedGoals: 2,
        $createdAt: "",
        $updatedAt: "",
      });
      mockAppwrite.signOut.mockResolvedValue(undefined);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.user).not.toBeNull();
      });

      await act(async () => {
        await result.current.signOut();
      });

      expect(mockAppwrite.signOut).toHaveBeenCalled();
      expect(result.current.user).toBeNull();
    });
  });

  describe("incrementClickCount", () => {
    it("should increment click count", async () => {
      mockAppwrite.getCurrentUser.mockResolvedValue({
        $id: "user-123",
        email: "test@example.com",
        name: "Test User",
      });
      mockAppwrite.getUserProfile.mockResolvedValue({
        $id: "user-123",
        $sequence: 1,
        $tableId: "user-profiles",
        $databaseId: "main",
        $permissions: [],
        nickName: "TestNick",
        email: "test@example.com",
        clickCount: 10,
        completedGoals: 0,
        $createdAt: "",
        $updatedAt: "",
      });
      mockAppwrite.updateUserProgress.mockResolvedValue(undefined);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.user?.clickCount).toBe(10);
      });

      await act(async () => {
        await result.current.incrementClickCount();
      });

      expect(result.current.user?.clickCount).toBe(11);
      expect(mockAppwrite.updateUserProgress).toHaveBeenCalledWith(
        "user-123",
        11,
        0,
      );
    });

    it("should reset to 0 and increment completedGoals when reaching max clicks", async () => {
      const MAX_CLICKS = 1500;
      mockAppwrite.getCurrentUser.mockResolvedValue({
        $id: "user-123",
        email: "test@example.com",
        name: "Test User",
      });
      mockAppwrite.getUserProfile.mockResolvedValue({
        $id: "user-123",
        $sequence: 1,
        $tableId: "user-profiles",
        $databaseId: "main",
        $permissions: [],
        nickName: "TestNick",
        email: "test@example.com",
        clickCount: MAX_CLICKS, // At max
        completedGoals: 2,
        $createdAt: "",
        $updatedAt: "",
      });
      mockAppwrite.updateUserProgress.mockResolvedValue(undefined);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.user?.clickCount).toBe(MAX_CLICKS);
      });

      await act(async () => {
        await result.current.incrementClickCount();
      });

      expect(result.current.user?.clickCount).toBe(0);
      expect(result.current.user?.completedGoals).toBe(3);
      expect(mockAppwrite.updateUserProgress).toHaveBeenCalledWith(
        "user-123",
        0,
        3,
      );
    });

    it("should not increment if no user is logged in", async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.incrementClickCount();
      });

      expect(mockAppwrite.updateUserProgress).not.toHaveBeenCalled();
    });
  });

  describe("deleteAccount", () => {
    it("should delete account and clear user state", async () => {
      mockAppwrite.getCurrentUser.mockResolvedValue({
        $id: "user-123",
        email: "test@example.com",
        name: "Test User",
      });
      mockAppwrite.getUserProfile.mockResolvedValue({
        $id: "user-123",
        $sequence: 1,
        $tableId: "user-profiles",
        $databaseId: "main",
        $permissions: [],
        nickName: "TestNick",
        email: "test@example.com",
        clickCount: 100,
        completedGoals: 2,
        $createdAt: "",
        $updatedAt: "",
      });
      mockAppwrite.deleteAccount.mockResolvedValue(undefined);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.user).not.toBeNull();
      });

      await act(async () => {
        await result.current.deleteAccount();
      });

      expect(mockAppwrite.deleteAccount).toHaveBeenCalledWith("user-123");
      expect(result.current.user).toBeNull();
    });
  });
});
