import { useAuth } from "@/app/contexts/AuthContext";
import { Feather, Octicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Header = ({ setMessages }) => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { colors } = theme;
  const { token } = useAuth();

  const clearChat = async () => {
    Alert.alert(
      "Clear Chat History",
      "Are you sure you want to clear all chat history? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetch(
                `${BACKEND}/api/chat/clear?soft=true`,
                {
                  method: "DELETE",
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              if (response.ok) {
                setMessages([]);
              } else {
                Alert.alert("Error", "Failed to clear chat history");
              }
            } catch (error) {
              console.error("Error clearing chat:", error);
              Alert.alert("Error", "Failed to clear chat history");
            }
          },
        },
      ]
    );
  };
  return (
    <View style={[styles.header]}>
      <View style={styles.headerLeft}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Dastavez AI
        </Text>
      </View>
      <View style={{ flexDirection: "row", gap: 14 }}>
        <TouchableOpacity onPress={clearChat} style={styles.clearButton}>
          <Octicons name="trash" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Settings")}
          style={[styles.settingsBtn, { backgroundColor: colors.textTertiary }]}
        >
          <Feather name="user" size={24} color={colors.background} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  clearButton: {
    padding: 8,
  },
  settingsBtn: {
    borderRadius: 20,
    padding: 8,
  },
});
