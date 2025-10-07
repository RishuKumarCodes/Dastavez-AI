import { createStackNavigator } from "@react-navigation/stack";
import { View } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

import EditProfilepage from "../protected/EditProfilePage";
import HomeScreen from "../protected/HomeScreen";
import SettingsScreen from "../protected/SetttingsScreen";

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { theme } = useTheme();
  const { colors } = theme;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />

        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="EditProfile" component={EditProfilepage} />
      </Stack.Navigator>
    </View>
  );
}
