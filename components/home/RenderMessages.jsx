import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

const { width } = Dimensions.get("window");

function RenderMessages({ item }) {
  const { theme } = useTheme();
  const { colors } = theme;
  const isUser = item.isUser;
  const messageTime = item.timestamp.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Single animation value for smooth entrance
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Single smooth animation that handles all transformations
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  // Interpolated values for smooth animations
  const opacity = animatedValue.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, 0, 1],
  });

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [15, 0],
  });

  const scale = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.95, 0.98, 1],
  });

  return (
    <Animated.View
      style={{
        marginVertical: 4,
        alignSelf: isUser ? "flex-end" : "flex-start",
        opacity,
        transform: [{ translateY }, { scale }],
      }}
    >
      <View
        style={[
          styles.messageContainer,
          {
            backgroundColor: isUser && colors.chatSecondary,
            maxWidth: width * 0.8,
            paddingHorizontal: 15,
            paddingVertical: 10,
            borderTopLeftRadius: isUser ? 18 : 4,
            borderTopRightRadius: isUser ? 4 : 18,
            borderBottomLeftRadius: 18,
            borderBottomRightRadius: 18,
          },
        ]}
      >
        <Text style={[styles.messageText, { color: colors.text }]}>
          {item.text}
        </Text>

        {item.file && (
          <View
            style={[
              styles.fileContainer,
              {
                borderColor: isUser ? "rgba(255,255,255,0.3)" : colors.border,
                marginTop: 8,
                backgroundColor: isUser
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.05)",
              },
            ]}
          >
            <Ionicons
              name="document-outline"
              size={16}
              color={isUser ? "rgba(255,255,255,0.8)" : colors.textSecondary}
              style={{ marginRight: 6 }}
            />
            <Text
              style={[
                styles.fileName,
                {
                  color: isUser
                    ? "rgba(255,255,255,0.8)"
                    : colors.textSecondary,
                },
              ]}
            >
              {item.file.name}
            </Text>
          </View>
        )}
      </View>

      <Animated.Text
        style={[
          styles.messageTime,
          { marginBottom: isUser ? 0 : 20 },

          {
            color: colors.textTertiary,
            fontSize: 11,
            marginTop: 4,
            alignSelf: isUser ? "flex-end" : "flex-start",
            opacity: animatedValue.interpolate({
              inputRange: [0, 0.7, 1],
              outputRange: [0, 0, 0.7],
            }),
          },
        ]}
      >
        {messageTime}
      </Animated.Text>
    </Animated.View>
  );
}

export default RenderMessages;

const styles = StyleSheet.create({
  messageContainer: {
    justifyContent: "center",
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "400",
  },
  fileContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  fileName: {
    fontSize: 13,
    fontWeight: "500",
  },
  messageTime: {
    fontWeight: "400",
  },
});
