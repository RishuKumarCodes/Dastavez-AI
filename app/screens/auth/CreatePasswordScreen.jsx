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
import OTPInput from "../../components/OTPInput";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import AuthStyles from "./AuthStyling.jsx";

export default function CreatePasswordScreen({ navigation, route }) {
  const { theme } = useTheme();
  const { createAccount } = useAuth();
  const { email, firstName, lastName } = route.params || {};
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!newPassword.trim() || !confirmPassword.trim()) {
      Alert.alert("Error", "Please fill in all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const result = await createAccount({
        email,
        firstName,
        lastName,
        password: newPassword,
      });

      if (result.success) {
        // Account created successfully, user will be automatically logged in
      } else {
        Alert.alert("Error", result.error || "Failed to create account");
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
              Create new password
            </Text>

            <View style={AuthStyles.inputContainer}>
              <Text style={[AuthStyles.label, { color: theme.colors.text }]}>
                First name
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
                value={firstName}
                editable={false}
              />
            </View>

            <View style={AuthStyles.inputContainer}>
              <Text style={[AuthStyles.label, { color: theme.colors.text }]}>
                Enter new password
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
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                placeholder="••••••••"
              />
            </View>

            <View style={AuthStyles.inputContainer}>
              <Text style={[AuthStyles.label, { color: theme.colors.text }]}>
                Re-enter password
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
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                placeholder="••••••••"
              />
            </View>

            <View style={AuthStyles.inputContainer}>
              <Text style={[AuthStyles.label, { color: theme.colors.text }]}>
                Enter OTP
              </Text>
              <OTPInput value={otp} onChange={setOtp} />
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
                {loading ? "Creating Account..." : "Login →"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
