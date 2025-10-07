import { StyleSheet } from "react-native";
const AuthStyles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  keyboardView: {
    flex: 1,
    zIndex: 2,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  card: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 24,
    marginVertical: "auto",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 8,
    fontWeight: "400",
  },
  input: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  primaryButton: {
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    marginTop: 16,
  },
  primaryButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
  checkboxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 16,
  },
  checkbox: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderRadius: 4,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  checkmark: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  checkboxText: {
    fontSize: 14,
  },
  forgotText: {
    fontSize: 14,
  },
  welcome: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 40,
  },
  buttonContainer: {
    gap: 16,
  },
  button: {
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fbbf24",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  logoEmoji: {
    fontSize: 40,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "600",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  otpInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 18,
    fontWeight: "600",
  },
});
export default AuthStyles;
