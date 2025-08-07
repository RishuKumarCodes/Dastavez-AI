import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Switch } from "react-native-gesture-handler";
import { useTheme } from "../../contexts/ThemeContext";

const SettingsItem = ({
  iconName,
  title,
  onPress,
  iconColor,
  hasSwitch,
  switchValue,
  onSwitchChange,
}) => {
  const { theme } = useTheme();
  const { colors } = theme;

  return (
    <TouchableOpacity
      style={styles.settingsItem}
      onPress={!hasSwitch ? onPress : undefined}
      activeOpacity={0.7}
    >
      <View style={styles.settingsItemLeft}>
        <View style={styles.iconContainer}>
          <Ionicons name={iconName} size={20} color={iconColor} />
        </View>
        <View style={styles.settingsItemText}>
          <Text style={[styles.settingsItemTitle, { color: colors.text }]}>
            {title}
          </Text>
        </View>
      </View>
      {hasSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{
            false: colors.border,
            true: colors.primary,
          }}
          thumbColor={switchValue ? colors.surface : colors.inputBackground}
        />
      ) : (
        <Ionicons
          name="chevron-forward"
          size={16}
          color={colors.textSecondary}
        />
      )}
    </TouchableOpacity>
  );
};

export default SettingsItem;

const styles = {
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  settingsItemLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  settingsItemText: { marginLeft: 12, flex: 1 },
  settingsItemTitle: { fontSize: 16, fontWeight: "500" },
};
