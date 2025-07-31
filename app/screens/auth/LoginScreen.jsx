import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Logo from "../../components/Logo";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import AuthStyles from "./AuthStyling.jsx";

export default function LoginScreen({ navigation }) {
  const { theme } = useTheme();
  const { login } = useAuth();
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
        password,
        rememberMe,
      });

      if (!result.success) {
        Alert.alert("Error", result.error || "Login failed");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
              />
            </View>

            <View style={AuthStyles.checkboxContainer}>
              <TouchableOpacity
                style={AuthStyles.checkbox}
                onPress={() => setRememberMe(!rememberMe)}
              >
                <View
                  style={[
                    AuthStyles.checkboxBox,
                    { borderColor: theme.colors.border },
                    rememberMe && { backgroundColor: theme.colors.primary },
                  ]}
                >
                  {rememberMe && <Text style={AuthStyles.checkmark}>✓</Text>}
                </View>
                <Text
                  style={[
                    AuthStyles.checkboxText,
                    { color: theme.colors.text },
                  ]}
                >
                  Remember me
                </Text>
              </TouchableOpacity>

              <TouchableOpacity>
                <Text
                  style={[
                    AuthStyles.forgotText,
                    { color: theme.colors.primary },
                  ]}
                >
                  Forgot Password ?
                </Text>
              </TouchableOpacity>
            </View>

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
              <Text style={AuthStyles.primaryButtonText}>
                {loading ? "Logging in..." : "Login →"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
