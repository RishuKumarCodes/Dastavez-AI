import AppleLogo from "@/assets/icons/AppleLogo.tsx";
import GoogleLogo from "@/assets/icons/GoogleLogo.tsx";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Logo from "../../components/Logo";
import { useTheme } from "../../contexts/ThemeContext";
import AuthStyles from "./AuthStyling.jsx";

export default function InitialScreen({ navigation }) {
  const { theme } = useTheme();
  const [email, setEmail] = useState("123example@gmail.com");

  const handleContinue = () => {
    navigation.navigate("CreateAccount", { email });
  };

  if (!theme) return;

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
              {
                backgroundColor: theme.colors.cardBackground,
                borderRadius: 20,
                margin: 20,
                padding: 24,
              },
            ]}
          >
            <Text
              style={[
                AuthStyles.title,
                {
                  color: theme.colors.text,
                  marginBottom: 8,
                },
              ]}
            >
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
            >
              <Text style={AuthStyles.primaryButtonText}>Continue →</Text>
            </TouchableOpacity>

            <View
              style={{
                flexDirection: "row",
                gap: 8,
                alignItems: "center",
                marginVertical: 5,
              }}
            >
              <View
                style={[
                  styles.orContainer,
                  { borderTopColor: theme.colors.inputBackground },
                ]}
              ></View>
              <Text style={[{ color: theme.colors.textSecondary }]}>Or</Text>
              <View
                style={[
                  styles.orLine,
                  { borderTopColor: theme.colors.inputBackground },
                ]}
              ></View>
            </View>

            <TouchableOpacity
              style={[
                styles.socialButton,
                { borderColor: theme.colors.border },
              ]}
            >
              <GoogleLogo />
              <Text style={[styles.socialBtnTxt, { color: theme.colors.text }]}>
                Continue with Google
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.socialButton,
                { borderColor: theme.colors.border },
              ]}
            >
              <AppleLogo color={theme.colors.text} />
              <Text style={[styles.socialBtnTxt, { color: theme.colors.text }]}>
                Continue with Apple
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  orContainer: {
    flex: 1,
    borderTopWidth: 1,
    marginVertical: "auto",
  },
  orLine: {
    flex: 1,
    borderTopWidth: 1,
    marginVertical: "auto",
  },
  socialButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginVertical: 4,
  },
  socialBtnTxt: {
    fontSize: 16,
  },
});
