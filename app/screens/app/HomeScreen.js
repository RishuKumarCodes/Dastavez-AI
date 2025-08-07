import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";

const { width, height } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const { token } = useAuth();

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [userInfo, setUserInfo] = useState({
    remainingMessages: 0,
    subscriptionStatus: "free",
  });

  const flatListRef = useRef(null);

  useEffect(() => {
    fetchChatHistory();
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch(
        "https://law-ai-7y05.onrender.com/auth/user",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const userData = await response.json();
        setUserInfo({
          remainingMessages: userData.remainingMessages || 0,
          subscriptionStatus: userData.subscriptionStatus || "free",
        });
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const fetchChatHistory = async () => {
    try {
      const response = await fetch(
        "https://law-ai-7y05.onrender.com/api/chat/history",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const history = await response.json();
        const formattedMessages = history.map((msg, index) => ({
          id: index.toString(),
          text: msg.content,
          isUser: msg.role === "user",
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim() && !uploadedFile) return;

    // Check message limits for free users
    if (
      userInfo.subscriptionStatus === "free" &&
      userInfo.remainingMessages <= 0
    ) {
      Alert.alert(
        "Message Limit Reached",
        "You've reached your free message limit. Upgrade to Premium for unlimited messages.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Upgrade",
            onPress: () => navigation.navigate("Subscription"),
          },
        ]
      );
      return;
    }

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
      const response = await fetch(
        "https://law-ai-7y05.onrender.com/api/chat/message",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: inputText.trim() || "Please analyze this file",
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();

        const aiMessage = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          isUser: false,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiMessage]);

        // Update user info
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

  // const pickDocument = async () => {
  //   try {
  //     const result = await DocumentPicker.getDocumentAsync({
  //       type: [
  //         "application/pdf",
  //         "application/msword",
  //         "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  //         "text/plain",
  //         "image/*",
  //       ],
  //       copyToCacheDirectory: true,
  //     });

  //     if (!result.canceled && result.assets[0]) {
  //       const file = result.assets[0];

  //       // Check file size (5MB limit)
  //       if (file.size > 5 * 1024 * 1024) {
  //         Alert.alert(
  //           "File Too Large",
  //           "Please select a file smaller than 5MB."
  //         );
  //         return;
  //       }

  //       await uploadFile(file);
  //     }
  //   } catch (error) {
  //     console.error("Error picking document:", error);
  //     Alert.alert("Error", "Failed to pick document");
  //   }
  // };

  const uploadFile = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", {
        uri: file.uri,
        type: file.mimeType,
        name: file.name,
      });

      const response = await fetch(
        "https://law-ai-7y05.onrender.com/api/files/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUploadedFile({
          id: data.file._id,
          name: data.file.fileName,
          type: data.file.fileType,
          url: data.file.fileUrl,
        });

        // Update remaining messages
        setUserInfo({
          remainingMessages: data.remainingMessages,
          subscriptionStatus: data.subscriptionStatus,
        });
      } else {
        const errorData = await response.json();
        Alert.alert("Upload Failed", errorData.message);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      Alert.alert("Error", "Failed to upload file");
    }
  };

  const clearChat = async () => {
    Alert.alert(
      "Clear Chat History",
      "Are you sure you want to clear all chat history? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetch(
                "https://law-ai-7y05.onrender.com/api/chat/clear",
                {
                  method: "DELETE",
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              if (response.ok) {
                setMessages([]);
              } else {
                Alert.alert("Error", "Failed to clear chat history");
              }
            } catch (error) {
              console.error("Error clearing chat:", error);
              Alert.alert("Error", "Failed to clear chat history");
            }
          },
        },
      ]
    );
  };

  const renderMessage = ({ item }) => {
    const isUser = item.isUser;
    const messageTime = item.timestamp.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <View
        style={[
          styles.messageContainer,
          {
            alignSelf: isUser ? "flex-end" : "flex-start",
            backgroundColor: isUser ? colors.primary : colors.surface,
            maxWidth: width * 0.8,
          },
        ]}
      >
        <Text
          style={[
            styles.messageText,
            {
              color: isUser ? "#ffffff" : colors.text,
            },
          ]}
        >
          {item.text}
        </Text>

        {item.file && (
          <View style={[styles.fileContainer, { borderColor: colors.border }]}>
            <Ionicons
              name="document-outline"
              size={16}
              color={isUser ? "#ffffff" : colors.textSecondary}
            />
            <Text
              style={[
                styles.fileName,
                { color: isUser ? "#ffffff" : colors.textSecondary },
              ]}
            >
              {item.file.name}
            </Text>
          </View>
        )}

        <Text
          style={[
            styles.messageTime,
            {
              color: isUser ? "rgba(255,255,255,0.8)" : colors.textSecondary,
            },
          ]}
        >
          {messageTime}
        </Text>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons
        name="chatbubbles-outline"
        size={64}
        color={colors.textTertiary}
      />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        Welcome to Law AI
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

  if (loadingHistory) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={["top"]}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Loading chat history...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <StatusBar
        backgroundColor={colors.surface}
        translucent={false}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.surface }]}>
          <View style={styles.headerLeft}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              Law AI Assistant
            </Text>
          </View>
          <TouchableOpacity onPress={clearChat} style={styles.clearButton}>
            <Ionicons name="trash-outline" size={20} color={colors.secondary} />
          </TouchableOpacity>
        </View>

        {/* Message Limit Indicator */}
        {/* {userInfo.subscriptionStatus === "free" && (
          <View
            style={[
              styles.messageLimit,
              { backgroundColor: colors.cardBackground },
            ]}
          >
            <Text style={[styles.messageLimitText, { color: colors.text }]}>
              {userInfo.remainingMessages} free messages remaining
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Subscription")}
            >
              <Text style={[styles.upgradeText, { color: colors.primary }]}>
                Upgrade
              </Text>
            </TouchableOpacity>
          </View>
        )} */}

        {/* Chat Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.chatContainer}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          ListEmptyComponent={renderEmptyState}
        />

        {/* File Upload Preview */}
        {uploadedFile && (
          <View
            style={[styles.uploadPreview, { backgroundColor: colors.surface }]}
          >
            <View style={styles.fileInfo}>
              <Ionicons
                name="document-outline"
                size={20}
                color={colors.primary}
              />
              <Text
                style={[styles.uploadFileName, { color: colors.text }]}
                numberOfLines={1}
              >
                {uploadedFile.name}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setUploadedFile(null)}>
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        )}

        {/* Input Container */}
        <View style={[styles.inputContainer]}>
          {/* <TouchableOpacity
            onPress={pickDocument}
            style={[
              styles.attachButton,
              { backgroundColor: colors.inputBackground },
            ]}
          >
            <Ionicons name="attach-outline" size={20} color={colors.primary} />
          </TouchableOpacity> */}

          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: colors.cardBackground,
                color: colors.text,
              },
            ]}
            placeholder="Ask me anything about law..."
            placeholderTextColor={colors.textSecondary}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={1000}
          />

          <TouchableOpacity
            onPress={sendMessage}
            style={[
              styles.sendButton,
              {
                backgroundColor:
                  inputText.trim() || uploadedFile
                    ? colors.primary
                    : colors.textTertiary,
              },
            ]}
            disabled={loading || (!inputText.trim() && !uploadedFile)}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Ionicons name="send" size={20} color="#ffffff" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  clearButton: {
    padding: 8,
  },
  messageLimit: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
  },
  messageLimitText: {
    fontSize: 14,
  },
  upgradeText: {
    fontSize: 14,
    fontWeight: "600",
  },
  chatContainer: {
    padding: 16,
    flexGrow: 1,
  },
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
  messageContainer: {
    marginVertical: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  fileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
  },
  fileName: {
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
  },
  messageTime: {
    fontSize: 12,
    marginTop: 4,
    alignSelf: "flex-end",
  },
  uploadPreview: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    margin: 16,
    padding: 12,
    borderRadius: 8,
  },
  fileInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  uploadFileName: {
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 10,
    margin: 5,
  },
  attachButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    width: 38,
    height: 38,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
};

export default HomeScreen;
