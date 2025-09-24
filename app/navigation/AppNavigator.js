import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

import EditProfilepage from "../screens/app/EditProfilePage";
import HomeScreen from "../screens/app/HomeScreen";
import SettingsScreen from "../screens/app/SetttingsScreen";

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { theme } = useTheme();
  const { colors } = theme;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Home is your main screen */}
        <Stack.Screen name="Home" component={HomeScreen} />

        {/* Settings flow */}
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="EditProfile" component={EditProfilepage} />
      </Stack.Navigator>
    </View>
  );
}
