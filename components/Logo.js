import LogoImage from "@/assets/icons/icon.png";
import { Image, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

export function MainLogo() {
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

export function Logo() {
  const { theme } = useTheme();

  return (
    <View style={styles.miniLogoContainer}>
      <Image
        source={LogoImage}
        style={{ width: 35, height: 35 }}
        resizeMode="contain"
      />
      <Text style={[styles.miniLogoText, { color: theme.colors.text }]}>
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
  logoText: {
    marginTop: -10,
    fontSize: 20,
    fontWeight: "700",
  },
  miniLogoContainer: {
    marginTop: 48,
    marginLeft: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  miniLogoText: {
    marginLeft: 2,
    fontSize: 19,
    fontWeight: "600",
  },
});
