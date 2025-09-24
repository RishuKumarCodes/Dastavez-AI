import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

const EmptyState = ({ setInputText }) => {
  const { theme } = useTheme();
  const { colors } = theme;

  return (
    <View style={styles.emptyContainer}>
      <Ionicons name="chatbubbles-outline" size={64} color={colors.secondary} />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        Welcome to Dastavez AI
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        Ask me anything about law, upload legal documents for analysis, or get
        help with legal research.
      </Text>
      <View style={styles.suggestionContainer}>
        <TouchableOpacity
          style={[styles.suggestionChip, { backgroundColor: colors.surface }]}
          onPress={() => setInputText("What is contract law?")}
        >
          <Text style={[styles.suggestionText, { color: colors.text }]}>
            What is contract law?
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.suggestionChip, { backgroundColor: colors.surface }]}
          onPress={() => setInputText("Explain intellectual property rights")}
        >
          <Text style={[styles.suggestionText, { color: colors.text }]}>
            Explain IP rights
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EmptyState;

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 16,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 16,
    marginTop: 8,
    textAlign: "center",
    lineHeight: 24,
  },
  suggestionContainer: {
    marginTop: 24,
    alignItems: "center",
  },
  suggestionChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
  },
  suggestionText: {
    fontSize: 14,
  },
});
