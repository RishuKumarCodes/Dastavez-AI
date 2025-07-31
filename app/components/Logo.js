import LogoImage from "@/assets/icons/icon.png";
import { Image, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

export default function Logo() {
  const { theme } = useTheme();

  return (
    <View style={styles.logoContainer}>
      <Image
        source={LogoImage}
        style={{ width: 150, height: 150 }}
        resizeMode="contain"
      />
      <Text style={[styles.logoText, { color: theme.colors.text }]}>
        Dastavez AI
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    marginTop: 40,
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  logoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  logoEmoji: {
    fontSize: 24,
  },
  logoText: {
    marginTop: -10,
    fontSize: 20,
    fontWeight: "700",
  },
});
