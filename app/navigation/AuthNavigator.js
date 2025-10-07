import { createStackNavigator } from "@react-navigation/stack";
import CreateAccountScreen from "../auth/CreateAccountScreen";
import InitialScreen from "../auth/InitialScreen";
import LoginScreen from "../auth/LoginScreen";
import VerifyResetOtp from "../auth/VerifyResetOtp";

const Stack = createStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Initial" component={InitialScreen} />
      <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
      <Stack.Screen name="VerifyResetOtp" component={VerifyResetOtp} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}
