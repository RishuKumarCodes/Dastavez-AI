import { createContext, useContext, useEffect, useState } from "react";
import { Appearance } from "react-native";
import {
  getString,
  removeItem,
  setString,
  StorageKeys,
} from "../storage/ThemeSetting";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const lightTheme = {
  colors: {
    background: "#ffffff",
    surface: "#e8edf8ff",
    primary: "#3b82f6",
    secondary: "#fbbf24",
    text: "#1f2937",
    textSecondary: "#6b7280",
    textTertiary: "#7894c7ff",
    border: "#a9b6ffff",
    inputBackground: "#B2CEFF",
    cardBackground: "#DBE8FF",
  },
};

export const darkTheme = {
  colors: {
    background: "#1A1F2C",
    surface: "#252e3fff",
    primary: "#3b82f6",
    secondary: "#c99000ff",
    text: "#ffffff",
    textSecondary: "#d1d5db",
    textTertiary: "#5a71a0ff",
    border: "#737ebdff",
    inputBackground: "#203354",
    cardBackground: "#304B7A",
  },
};

export default function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(Appearance.getColorScheme() === "dark");
  const [isSystemTheme, setIsSystemTheme] = useState(true);

  useEffect(() => {
    async function load() {
      const savedSystem = await getString(StorageKeys.IS_SYSTEM_THEME);
      const followSystem = savedSystem == null ? true : JSON.parse(savedSystem);
      setIsSystemTheme(followSystem);

      if (followSystem) {
        setIsDark(Appearance.getColorScheme() === "dark");
      } else {
        const savedTheme = await getString(StorageKeys.THEME);
        setIsDark(savedTheme === "dark");
      }
    }
    load();

    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      if (isSystemTheme) {
        setIsDark(colorScheme === "dark");
      }
    });
    return () => sub.remove();
  }, [isSystemTheme]);

  const toggleTheme = async () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    setIsSystemTheme(false);

    await setString(StorageKeys.THEME, nextDark ? "dark" : "light");
    await setString(StorageKeys.IS_SYSTEM_THEME, JSON.stringify(false));
  };

  const useSystemTheme = async () => {
    setIsSystemTheme(true);
    setIsDark(Appearance.getColorScheme() === "dark");

    await setString(StorageKeys.IS_SYSTEM_THEME, JSON.stringify(true));
    await removeItem(StorageKeys.THEME);
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider
      value={{ theme, isDark, isSystemTheme, toggleTheme, useSystemTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
