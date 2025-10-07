import { Picker } from "@react-native-picker/picker";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

const ThemeSelector = () => {
  const { theme, isDark, isSystemTheme, toggleTheme, useSystemTheme } =
    useTheme();
  const { colors } = theme;

  const selectedValue = isSystemTheme ? "system" : isDark ? "dark" : "light";

  const onValueChange = (value) => {
    if (value === "system") {
      useSystemTheme();
    } else {
      if (isSystemTheme) {
        if ((value === "dark") !== isDark) {
          toggleTheme();
        }
      } else {
        if ((value === "dark") !== isDark) {
          toggleTheme();
        }
      }
    }
  };

  return (
    <View style={styles.row}>
      <Text style={{ color: colors.text, fontSize: 16, fontWeight: "500" }}>
        Theme
      </Text>
      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={[
          {
            width: 150,
            color: colors.text,
            backgroundColor: colors.surface,
          },
        ]}
        dropdownIconColor={colors.textSecondary}
      >
        <Picker.Item label="System Default" value="system" />
        <Picker.Item label="Light Mode" value="light" />
        <Picker.Item label="Dark Mode" value="dark" />
      </Picker>
    </View>
  );
};

export default ThemeSelector;

const styles = StyleSheet.create({
  row: {
    marginBottom: -15,
    marginLeft: 20,
    marginRight: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
