import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

const SettingsSection = ({ title, children }) => {
  const { theme } = useTheme();
  const { colors } = theme;
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
        {title.toUpperCase()}
      </Text>
      <View
        style={[styles.sectionContent, { backgroundColor: colors.surface }]}
      >
        {children}
      </View>
    </View>
  );
};

export default SettingsSection;

const styles = StyleSheet.create({
  section: { marginTop: 20 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    opacity: 0.8,
    letterSpacing: 0.7,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  sectionContent: {
    marginHorizontal: 12,
    borderRadius: 16,
    paddingBottom: 16,
  },
});
