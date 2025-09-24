import AppleLogo from "@/assets/icons/AppleLogo.tsx";
import GoogleLogo from "@/assets/icons/GoogleLogo.tsx";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Config from "react-native-config";
import AnimatedStars from "../../components/GoldenStarsAnimation";

import { MainLogo } from "../../components/Logo";
import { useTheme } from "../../contexts/ThemeContext";
import AuthStyles from "./AuthStyling.jsx";
export default function InitialScreen({ navigation }) {
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const BACKEND = Config.BACKEND_URL || "https://dastavezai-backend-797326917118.asia-south2.run.app";

  const handleContinue = async () => {
    if (!email.trim()) {
      Alert.alert("Validation", "Please enter your email.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BACKEND}/api/auth/check-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (!res.ok) {
        throw new Error(`Server responded with status ${res.status}`);
      }

      const { exists, message } = await res.json();
      if (exists) {
        navigation.navigate("Login", { email: email.trim() });
      } else {
        navigation.navigate("CreateAccount", { email: email.trim() });
      }
    } catch (err) {
      console.error("Email check failed:", err);
      Alert.alert(
        "Network Error",
        err.message || "Unable to check email. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!theme) return null;

  return (
    <SafeAreaView
      style={[
        AuthStyles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <AnimatedStars />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={AuthStyles.keyboardView}
      >
        <View style={AuthStyles.content}>
          <MainLogo />
          <View
            style={[
              AuthStyles.card,
              { backgroundColor: theme.colors.cardBackground },
            ]}
          >
            <Text style={[AuthStyles.title, { color: theme.colors.text }]}>
              Login
            </Text>

            <View style={AuthStyles.inputContainer}>
              <Text style={[AuthStyles.label, { color: theme.colors.text }]}>
                Email
              </Text>
              <TextInput
                style={[
                  AuthStyles.input,
                  {
                    backgroundColor: theme.colors.inputBackground,
                    color: theme.colors.text,
                    borderColor: theme.colors.border,
                  },
                ]}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor={theme.colors.textTertiary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              style={[
                AuthStyles.primaryButton,
                { backgroundColor: theme.colors.secondary },
              ]}
              onPress={handleContinue}
              disabled={loading}
            >
              <Text style={AuthStyles.primaryButtonText}>
                {loading ? "Please wait…" : "Continue →"}
              </Text>
            </TouchableOpacity>

            <View style={styles.orRow}>
              <View
                style={[
                  styles.line,
                  { borderTopColor: theme.colors.inputBackground },
                ]}
              />
              <Text style={{ color: theme.colors.textSecondary }}>Or</Text>
              <View
                style={[
                  styles.line,
                  { borderTopColor: theme.colors.inputBackground },
                ]}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.socialButton,
                { borderColor: theme.colors.border },
              ]}
            >
              <GoogleLogo />
              <Text style={styles.socialBtnTxt}>Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.socialButton,
                { borderColor: theme.colors.border },
              ]}
            >
              <AppleLogo color={theme.colors.text} />
              <Text style={styles.socialBtnTxt}>Continue with Apple</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  orRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
    gap: 8,
  },
  line: {
    flex: 1,
    borderTopWidth: 1,
  },
  socialButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginVertical: 4,
  },
  socialBtnTxt: {
    fontSize: 16,
  },
});
