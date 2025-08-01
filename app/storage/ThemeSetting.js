import AsyncStorage from "@react-native-async-storage/async-storage";

export const StorageKeys = {
  THEME: "theme",
  IS_SYSTEM_THEME: "isSystemTheme",
};

export const getString = async (key) => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (err) {
    console.error(`Error getting ${key} from storage`, err);
    return null;
  }
};

export const setString = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (err) {
    console.error(`Error saving ${key} to storage`, err);
  }
};

export const removeItem = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (err) {
    console.error(`Error removing ${key} from storage`, err);
  }
};
