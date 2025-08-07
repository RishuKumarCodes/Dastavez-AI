import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import EditProfilepage from "../screens/app/EditProfilePage";
import HomeScreen from "../screens/app/HomeScreen";
import SettingsScreen from "../screens/app/SetttingsScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Settings Stack Navigator
const SettingsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="/" component={SettingsScreen} />
      <Stack.Screen name="EditProfile" component={EditProfilepage} />
    </Stack.Navigator>
  );
};

export default function AppNavigator() {
  const { theme } = useTheme();
  const { colors } = theme;

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            borderTopWidth: 1,
            backgroundColor: colors.background,
            borderColor: colors.surface,
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === "Home") {
              iconName = "home-outline";
            } else if (route.name === "Settings") {
              iconName = "settings-outline";
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Settings" component={SettingsStack} />
      </Tab.Navigator>
    </View>
  );
}
