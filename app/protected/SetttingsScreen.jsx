import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LogoutBtn from "../../components/settings/LogoutBtn.jsx";
import ProfileHeader from "../../components/settings/ProfileHeader.jsx";
import SettingsItem from "../../components/settings/SettingsItem.jsx";
import SettingsSection from "../../components/settings/SettingsSection.jsx";
import ThemeSelector from "../../components/settings/ThemeSelector.jsx";
import { useAuth } from "../../contexts/AuthContext.js";
import { useTheme } from "../../contexts/ThemeContext.js";

const SettingsPage = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const { token } = useAuth();

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    profileImage: null,
    subscriptionStatus: "free",
    remainingMessages: 0,
    isVerified: false,
    joinedDate: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(
        "https://dastavezai-backend-797326917118.asia-south2.run.app/api/profile/info",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const userData = await response.json();
        setUser({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userData.email || "",
          phone: userData.phone || "",
          profileImage: userData.profileImage || null,
          subscriptionStatus: userData.subscriptionStatus || "free",
          remainingMessages: userData.remainingMessages || 0,
          isVerified: userData.isVerified || false,
          joinedDate: userData.createdAt
            ? new Date(userData.createdAt).toISOString().split("T")[0]
            : "",
        });
      } else {
        Alert.alert("Error", "Failed to fetch user profile");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      Alert.alert("Error", "Failed to fetch user profile");
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    navigation.navigate("EditProfile", {
      user: user,
      onSave: async (updatedData) => {
        setUser((prevUser) => ({ ...prevUser, ...updatedData }));
        await fetchUserProfile();
      },
    });
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: colors.text }}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <ProfileHeader user={user} />

        <SettingsSection title="Account">
          <SettingsItem
            iconName="create-outline"
            title="Edit Profile"
            subtitle="Update your personal information"
            iconColor={colors.primary}
            onPress={handleEditProfile}
          />
          <SettingsItem
            iconName="key-outline"
            title="Account settings"
            subtitle="Change password or email"
            iconColor={colors.secondary}
            onPress={() =>
              Alert.alert(
                "Change Password",
                "Password change feature coming soon!"
              )
            }
          />

          <SettingsItem
            iconName="crown-outline"
            title={
              user.subscriptionStatus === "premium"
                ? "Premium Plan"
                : "Upgrade to Premium"
            }
            subtitle={
              user.subscriptionStatus === "premium"
                ? "Active subscription"
                : "Unlimited messages & features"
            }
            iconColor={
              user.subscriptionStatus === "premium"
                ? colors.secondary
                : colors.primary
            }
            onPress={() =>
              Alert.alert(
                "Subscription",
                "Subscription management coming soon!"
              )
            }
          />
        </SettingsSection>

        {/* Appearance Section */}
        <SettingsSection title="Appearance">
          <ThemeSelector />
        </SettingsSection>

        <SettingsSection title="Support & Legal">
          <SettingsItem
            iconName="help-circle-outline"
            title="Help Center"
            iconColor={colors.primary}
            onPress={() => Alert.alert("Help Center", "Opening help center...")}
          />
          <SettingsItem
            iconName="document-text-outline"
            title="Terms of Service"
            iconColor={colors.textSecondary}
            onPress={() => Alert.alert("Terms of Service", "Opening terms...")}
          />
          <SettingsItem
            iconName="shield-outline"
            title="Privacy Policy"
            iconColor={colors.textSecondary}
            onPress={() =>
              Alert.alert("Privacy Policy", "Opening privacy policy...")
            }
          />
        </SettingsSection>

        <LogoutBtn />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = {
  container: { flex: 1 },
  appVersion: { alignItems: "center", paddingBottom: 32 },
  versionText: { fontSize: 12 },
  versionSubtext: { fontSize: 12, marginTop: 4 },
};

export default SettingsPage;
