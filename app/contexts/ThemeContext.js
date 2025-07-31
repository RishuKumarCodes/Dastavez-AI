import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import { Appearance } from "react-native";

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
    border: "#a9b6ffff",
    inputBackground: "#B2CEFF",
    cardBackground: "#DBE8FF",
  },
};

// export const darkTheeeme = {
//   colors: {
//     background: "#1A1F2C",
//     surface: "#DBE8FF",
//     primary: "#3b82f6",
//     secondary: "#c99000ff",
//     text: "#ffffff",
//     textSecondary: "#d1d5db",
//     border: "#9AA9FF",
//     inputBackground: "#B2CEFF",
//     cardBackground: "#DBE8FF",
//   },
// };

export const darkTheme = {
  colors: {
    background: "#1A1F2C",
    surface: "#304B7A",
    primary: "#3b82f6",
    secondary: "#c99000ff",
    text: "#ffffff",
    textSecondary: "#d1d5db",
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

export default ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(Appearance.getColorScheme() === "dark");
  const [isSystemTheme, setIsSystemTheme] = useState(true);

  useEffect(() => {
    loadTheme();
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      // Only update if user is following system theme
      if (isSystemTheme) {
        setIsDark(colorScheme === "dark");
      }
    });
    return () => subscription?.remove();
  }, [isSystemTheme]);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("theme");
      const savedIsSystemTheme = await AsyncStorage.getItem("isSystemTheme");

      if (savedIsSystemTheme !== null) {
        const useSystemTheme = JSON.parse(savedIsSystemTheme);
        setIsSystemTheme(useSystemTheme);

        if (useSystemTheme) {
          // Follow system theme
          setIsDark(Appearance.getColorScheme() === "dark");
        } else if (savedTheme) {
          // Use saved manual theme
          setIsDark(savedTheme === "dark");
        }
      } else {
        // First time - follow system theme by default
        setIsSystemTheme(true);
        setIsDark(Appearance.getColorScheme() === "dark");
      }
    } catch (error) {
      console.error("Error loading theme:", error);
      setIsDark(Appearance.getColorScheme() === "dark");
    }
  };

  const toggleTheme = async () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    setIsSystemTheme(false); // User manually chose a theme

    try {
      await AsyncStorage.setItem("theme", newTheme ? "dark" : "light");
      await AsyncStorage.setItem("isSystemTheme", JSON.stringify(false));
    } catch (error) {
      console.error("Error saving theme:", error);
    }
  };

  const useSystemTheme = async () => {
    setIsSystemTheme(true);
    setIsDark(Appearance.getColorScheme() === "dark");

    try {
      await AsyncStorage.setItem("isSystemTheme", JSON.stringify(true));
      await AsyncStorage.removeItem("theme"); // Remove manual theme preference
    } catch (error) {
      console.error("Error saving system theme preference:", error);
    }
  };

  const theme = isDark ? darkTheme : lightTheme;

  const value = {
    theme,
    isDark,
    isSystemTheme,
    toggleTheme,
    useSystemTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
