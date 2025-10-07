import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Logo } from "../../components/Logo";
import { useTheme } from "../../contexts/ThemeContext";
import AuthStyles from "./AuthStyling.jsx";

export default function LoginScreen({ navigation, route }) {
  const { theme } = useTheme();
  const email = route.params?.email || "";
  const { login, forgotPassword } = useAuth();

  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!password.trim()) {
      Alert.alert("Error", "Please enter your password");
      return;
    }

    setLoading(true);
    try {
      const result = await login({
        email,
        password,
        rememberMe,
      });

      if (result && !result.success) {
        Alert.alert("Error", result.error || "Login failed");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    try {
      const res = await forgotPassword(email);
      if (res.success == true) {
        navigation.replace("VerifyResetOtp", { email });
      }
    } catch (err) {
      Alert.alert("Error", err.message);
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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={AuthStyles.keyboardView}
      >
        <View style={AuthStyles.content}>
          <Logo />

          <View
            style={[
              AuthStyles.card,
              { backgroundColor: theme.colors.cardBackground },
            ]}
          >
            <Text style={[AuthStyles.title, { color: theme.colors.text }]}>
              Login to your account
            </Text>

            <View style={AuthStyles.inputContainer}>
              <Text style={[AuthStyles.label, { color: theme.colors.text }]}>
                Password
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
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="••••••••"
                placeholderTextColor={theme.colors.textTertiary}
              />
            </View>

            <TouchableOpacity
              onPress={handleForgotPassword}
              style={{ marginLeft: "auto" }}
            >
              <Text
                style={[AuthStyles.forgotText, { color: theme.colors.primary }]}
              >
                Forgot Password?
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                AuthStyles.primaryButton,
                {
                  backgroundColor: theme.colors.secondary,
                  opacity: loading ? 0.7 : 1,
                },
              ]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={theme.colors.text} />
              ) : (
                <Text style={AuthStyles.primaryButtonText}>Login →</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
