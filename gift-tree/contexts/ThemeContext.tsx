import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "nativewind";
import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

type ThemeMode = "light" | "dark" | "system";

interface ThemeContextType {
  theme: ThemeMode;
  isDark: boolean;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "app_theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { colorScheme, setColorScheme } = useColorScheme();
  const [theme, setThemeState] = useState<ThemeMode>("system");
  const [isLoaded, setIsLoaded] = useState(false);

  const loadTheme = useCallback(async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme && ["light", "dark", "system"].includes(savedTheme)) {
        setThemeState(savedTheme as ThemeMode);
        if (savedTheme !== "system") {
          setColorScheme(savedTheme as "light" | "dark");
        }
      }
    } catch (error) {
      console.error("Error loading theme:", error);
    } finally {
      setIsLoaded(true);
    }
  }, [setColorScheme]);

  // Load saved theme preference
  useEffect(() => {
    loadTheme();
  }, [loadTheme]);

  const setTheme = async (newTheme: ThemeMode) => {
    setThemeState(newTheme);

    // Apply theme
    if (newTheme === "system") {
      setColorScheme("system");
    } else {
      setColorScheme(newTheme);
    }

    // Persist preference
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      console.error("Error saving theme:", error);
    }
  };

  const isDark = colorScheme === "dark";

  if (!isLoaded) {
    return null; // Or a loading spinner
  }

  return (
    <ThemeContext.Provider value={{ theme, isDark, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
