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
    surface: "#DBE8FF",
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
    surface: "#304B7A",
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

// the orignal theme provided by them:
// export const darkThemecopy = {
//   root: {
//     background: "#1a1f2c" /* Main dark background */,
//     judicialdark: "#1a1f2c" /* Same as background - dark navy */,

//     /* Secondary Backgrounds */
//     judicialnavy: "#203354" /* Navy blue for cards/sections */,
//     judicialblue: "#304b7a" /* Medium blue for accents */,

//     /* Card/Section Backgrounds */
//     card: "#2d3748" /* Dark card background */,
//     secondary: "#3a4a5f" /* Secondary background */,
//     muted: "#3d4758" /* Muted background */,
//   },
// };

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
