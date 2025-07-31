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
import { useTheme } from "../../contexts/ThemeContext";
import AuthStyles from "./AuthStyling.jsx";

export default function CreateAccountScreen({ navigation, route }) {
  const { theme } = useTheme();
  const { email } = route.params || {};
  const [firstName, setFirstName] = useState("Rishu");
  const [lastName, setLastName] = useState("Kumar");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = () => {
    if (!firstName.trim() || !lastName.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    navigation.navigate("CreatePassword", {
      email,
      firstName,
      lastName,
      password,
    });
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
              Create new account
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
                onChangeText={setFirstName}
              />
            </View>

            <View style={AuthStyles.inputContainer}>
              <Text style={[AuthStyles.label, { color: theme.colors.text }]}>
                Last name
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
                value={lastName}
                onChangeText={setLastName}
              />
            </View>

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
                { backgroundColor: theme.colors.secondary },
              ]}
              onPress={handleLogin}
            >
              <Text style={AuthStyles.primaryButtonText}>Login →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
