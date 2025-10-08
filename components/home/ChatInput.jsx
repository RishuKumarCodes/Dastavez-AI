import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

const ChatInput = ({
  inputText,
  setInputText,
  uploadedFile,
  setUploadedFile,
  userInfo,
  setUserInfo,
  setMessages,
  navigation,
  token,
  BACKEND,
}) => {
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  const { colors } = theme;

  const sendMessage = async () => {
    if (!inputText.trim() && !uploadedFile) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText.trim() || "File uploaded",
      isUser: true,
      timestamp: new Date(),
      file: uploadedFile,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setLoading(true);

    try {
      const response = await fetch(`${BACKEND}/api/chat/message`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputText.trim() || "Please analyze this file",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiMessage = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
        setUserInfo({
          remainingMessages: data.remainingMessages,
          subscriptionStatus: data.subscriptionStatus,
        });
      } else {
        const errorData = await response.json();
        Alert.alert("Error", errorData.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      Alert.alert("Error", "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
      setUploadedFile(null);
    }
  };

  return (
    <View
      style={[
        styles.inputContainer,
        { backgroundColor: colors.surface },
      ]}
    >
      <TextInput
        style={[styles.textInput, { color: colors.text }]}
        placeholder="Ask me anything about law..."
        placeholderTextColor={colors.textTertiary}
        value={inputText}
        onChangeText={setInputText}
        multiline
        maxLength={1000}
      />
      <TouchableOpacity
        onPress={sendMessage}
        style={[
          styles.sendButton,
          { opacity: inputText.trim() || uploadedFile ? 1 : 0.5 },
        ]}
        disabled={loading || (!inputText.trim() && !uploadedFile)}
      >
        {loading ? (
          <ActivityIndicator size="small" color={colors.text} />
        ) : (
          <Ionicons name="send" size={20} color={colors.text} />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ChatInput;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 8,
    width: 38,
    height: 38,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});