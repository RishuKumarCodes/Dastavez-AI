import { useAuth } from "@/app/contexts/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";
import { Alert, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

const LogoutBtn = () => {
  const { theme } = useTheme();
  const { colors } = theme;
  const { logout } = useAuth();

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => logout(),
      },
    ]);
  };

  return (
    <TouchableOpacity
      style={[styles.dangerZone, { color: colors.secondary }]}
      onPress={handleSignOut}
    >
      <MaterialIcons name="logout" size={24} color={"red"} />
      <Text style={{ fontSize: 18, color: "red" }}>Logout</Text>
    </TouchableOpacity>
  );
};

export default LogoutBtn;

const styles = StyleSheet.create({
  dangerZone: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 24,
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 20,
    padding: 10,
    borderRadius: 16,
  },
});
