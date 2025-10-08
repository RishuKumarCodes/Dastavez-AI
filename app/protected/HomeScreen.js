import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ChatInput from "../../components/home/ChatInput";
import EmptyState from "../../components/home/EmptyState";
import Header from "../../components/home/Header";
import RenderMessages from "../../components/home/RenderMessages";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";

const HomeScreen = () => {
  const { theme } = useTheme();
  const { colors, isDark } = theme;
  const { token } = useAuth();
  const BACKEND = "https://dastavezai-backend-797326917118.asia-south2.run.app";

  const navigation = useNavigation();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
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

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, () => {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {});

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch(`${BACKEND}/api/authuser`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

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
      const response = await fetch(`${BACKEND}/api/chat/history`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const history = await response.json();

      const formattedMessages = history.map((msg) => ({
        id: msg._id,
        text: msg.content,
        isUser: msg.role === "user",
        timestamp: new Date(msg.timestamp),
      }));

      setMessages(formattedMessages);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    } finally {
      setLoadingHistory(false);
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

  // const uploadFile = async (file) => {
  //   try {
  //     const formData = new FormData();
  //     formData.append("file", {
  //       uri: file.uri,
  //       type: file.mimeType,
  //       name: file.name,
  //     });

  //     const response = await fetch(`${BACKEND}/api/files/upload`, {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "multipart/form-data",
  //       },
  //       body: formData,
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       setUploadedFile({
  //         id: data.file._id,
  //         name: data.file.fileName,
  //         type: data.file.fileType,
  //         url: data.file.fileUrl,
  //       });

  //       // Update remaining messages
  //       setUserInfo({
  //         remainingMessages: data.remainingMessages,
  //         subscriptionStatus: data.subscriptionStatus,
  //       });
  //     } else {
  //       const errorData = await response.json();
  //       Alert.alert("Upload Failed", errorData.message);
  //     }
  //   } catch (error) {
  //     console.error("Error uploading file:", error);
  //     Alert.alert("Error", "Failed to upload file");
  //   }
  // };

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
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />

      <Header setMessages={setMessages} />

      {/* Message Limit Indicator */}
      {userInfo.subscriptionStatus === "free" && (
        <View
          style={[
            styles.messageLimit,
            { backgroundColor: colors.cardBackground },
          ]}
        >
          <Text style={[styles.messageLimitText, { color: colors.text }]}>
            {userInfo.remainingMessages} free messages remaining
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Subscription")}>
            <Text style={[styles.upgradeText, { color: colors.primary }]}>
              Upgrade
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        {/* Chat Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <RenderMessages item={item} />}
          contentContainerStyle={styles.chatContainer}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={<EmptyState setInputText={setInputText} />}
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

        {/* Chat Input */}
        <ChatInput
          inputText={inputText}
          setInputText={setInputText}
          uploadedFile={uploadedFile}
          setUploadedFile={setUploadedFile}
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          setMessages={setMessages}
          navigation={navigation}
          token={token}
          BACKEND={BACKEND}
        />
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
  keyboardView: {
    flex: 1,
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

  uploadPreview: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    margin: 16,
    marginBottom: 0,
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
};

export default HomeScreen;