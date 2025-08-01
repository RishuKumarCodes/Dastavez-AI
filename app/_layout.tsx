import { StatusBar } from "expo-status-bar";
import React from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ThemeProvider from "./contexts/ThemeContext";
import AppNavigator from "./navigation/AppNavigator";
import AuthNavigator from "./navigation/AuthNavigator";
import LoadingScreen from "./screens/LoadingScreen";

function RootNavigator() {
  const { token, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <StatusBar style="auto" />
      {token ? <AppNavigator /> : <AuthNavigator />}
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </ThemeProvider>
  );
}
