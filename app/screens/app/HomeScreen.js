import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";

export default function HomeScreen() {
  const { theme, toggleTheme, isDark, isSystemTheme, useSystemTheme } =
    useTheme();
  const { user, logout } = useAuth();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.content}>
        <Text style={[styles.welcome, { color: theme.colors.text }]}>
          Welcome, {user?.firstName}!
        </Text>

        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          You have successfully logged in to Dastavez AI
        </Text>

        <View style={styles.buttonContainer}>
          {isSystemTheme ? (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.colors.primary }]}
              onPress={toggleTheme}
            >
              <Text style={styles.buttonText}>
                Override System Theme (Currently: {isDark ? "Dark" : "Light"})
              </Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: theme.colors.primary },
                ]}
                onPress={toggleTheme}
              >
                <Text style={styles.buttonText}>
                  Switch to {isDark ? "Light" : "Dark"} Theme
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    backgroundColor: theme.colors.surface,
                    borderWidth: 1,
                    borderColor: theme.colors.primary,
                  },
                ]}
                onPress={useSystemTheme}
              >
                <Text
                  style={[styles.buttonText, { color: theme.colors.primary }]}
                >
                  Use System Theme
                </Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.secondary }]}
            onPress={logout}
          >
            <Text style={[styles.buttonText, { color: "#000" }]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  welcome: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "400",
    marginBottom: 30,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    gap: 15,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
  },
});
