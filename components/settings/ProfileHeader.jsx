import { Ionicons } from "@expo/vector-icons";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../contexts/ThemeContext";

const ProfileHeader = ({ user }) => {
  const { theme, isDark } = useTheme();
  const { colors } = theme;

  return (
    <SafeAreaView
      edges={["top"]}
      style={[styles.header, { backgroundColor: colors.cardBackground }]}
    >
      <ExpoStatusBar
        style={isDark ? "light" : "dark"}
        backgroundColor={colors.cardBackground}
        translucent={false}
        animated={true}
      />
      <View style={styles.profileContainer}>
        <View style={styles.profileImageContainer}>
          <View
            style={[
              styles.profileImageWrapper,
              { backgroundColor: colors.surface },
            ]}
          >
            {user?.profileImage ? (
              <Image
                source={{ uri: user.profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <Text
                style={[
                  styles.profileInitials,
                  { color: colors.textSecondary },
                ]}
              >
                {user?.firstName?.[0] ?? ""}
                {user?.lastName?.[0] ?? ""}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.profileInfo}>
          <Text style={[styles.profileName, { color: colors.text }]}>
            {user?.firstName} {user?.lastName}
          </Text>
          <View style={styles.badgeContainer}>
            <View
              style={[
                styles.badge,
                {
                  backgroundColor:
                    user?.subscriptionStatus === "premium"
                      ? colors.secondary + "33"
                      : colors.surface,
                },
              ]}
            >
              <Ionicons
                name={user?.subscriptionStatus === "premium" ? "crown" : "star"}
                size={12}
                color={
                  user?.subscriptionStatus === "premium"
                    ? colors.secondary
                    : colors.textTertiary
                }
              />
              <Text
                style={[
                  styles.badgeText,
                  {
                    color:
                      user?.subscriptionStatus === "premium"
                        ? colors.secondary
                        : colors.textTertiary,
                  },
                ]}
              >
                {user?.subscriptionStatus === "premium"
                  ? "Premium"
                  : "Free Plan"}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfileHeader;

const styles = StyleSheet.create({
  header: {
    paddingBottom: 12,
    paddingHorizontal: 5,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingTop: 20,
  },
  profileImageContainer: { position: "relative" },
  profileImageWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "rgba(84, 99, 126, 0.16)",
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: { width: 76, height: 76, borderRadius: 38 },
  profileInitials: { fontSize: 24, fontWeight: "bold" },
  profileInfo: { flex: 1, marginLeft: 16 },
  profileName: { fontSize: 20, fontWeight: "bold" },
  badgeContainer: { flexDirection: "row", marginTop: 8 },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: { fontSize: 12, marginLeft: 4 },
});
