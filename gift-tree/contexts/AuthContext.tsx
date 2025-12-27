import {
  signIn as appwriteSignIn,
  signOut as appwriteSignOut,
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
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, nickname: string) => Promise<void>;
  signOut: () => Promise<void>;
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
          nickname: profile?.nickname || currentUser.name || "User",
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
        nickname: profile?.nickname || authUser.name || "User",
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
        nickname: profile.nickname,
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

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
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
