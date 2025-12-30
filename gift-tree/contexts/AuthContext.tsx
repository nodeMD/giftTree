import {
  deleteAccount as appwriteDeleteAccount,
  signIn as appwriteSignIn,
  signOut as appwriteSignOut,
  updateClickCount as appwriteUpdateClickCount,
  createUser,
  getCurrentUser,
  getUserProfile,
} from "@/services/appwrite";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface User {
  id: string;
  email: string;
  nickname: string;
  clickCount: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, nickname: string) => Promise<void>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  incrementClickCount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        const profile = await getUserProfile(currentUser.$id);
        setUser({
          id: currentUser.$id,
          email: currentUser.email,
          nickname: profile?.nickName || currentUser.name || "User",
          clickCount: profile?.clickCount || 0,
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error loading user:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const authUser = await appwriteSignIn(email, password);
      const profile = await getUserProfile(authUser.$id);
      setUser({
        id: authUser.$id,
        email: authUser.email,
        nickname: profile?.nickName || authUser.name || "User",
        clickCount: profile?.clickCount || 0,
      });
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, nickname: string) => {
    try {
      const profile = await createUser(email, password, nickname);
      setUser({
        id: profile.$id,
        email: profile.email,
        nickname: profile.nickName,
        clickCount: 0,
      });
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await appwriteSignOut();
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  const deleteAccount = async () => {
    if (!user) return;
    try {
      await appwriteDeleteAccount(user.id);
      setUser(null);
    } catch (error) {
      console.error("Error deleting account:", error);
      throw error;
    }
  };

  const incrementClickCount = async () => {
    if (!user) return;

    const MAX_CLICKS = 5000;
    // Reset to 0 if we've reached the max, otherwise increment
    const newCount = user.clickCount >= MAX_CLICKS ? 0 : user.clickCount + 1;

    // Update local state immediately for responsiveness
    setUser({ ...user, clickCount: newCount });

    // Persist to database
    try {
      await appwriteUpdateClickCount(user.id, newCount);
    } catch (error) {
      console.error("Error updating click count:", error);
      // Revert on error
      setUser({ ...user, clickCount: user.clickCount });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
        deleteAccount,
        incrementClickCount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
