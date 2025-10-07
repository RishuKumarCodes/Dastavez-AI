import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthKeys = {
  TOKEN: "token",
};

export const getToken = async () => {
  try {
    return await AsyncStorage.getItem(AuthKeys.TOKEN);
  } catch (err) {
    console.error("Error reading auth token", err);
    return null;
  }
};

export const saveToken = async (token) => {
  try {
    await AsyncStorage.setItem(AuthKeys.TOKEN, token);
  } catch (err) {
    console.error("Error saving auth token", err);
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(AuthKeys.TOKEN);
  } catch (err) {
    console.error("Error removing auth token", err);
  }
};
