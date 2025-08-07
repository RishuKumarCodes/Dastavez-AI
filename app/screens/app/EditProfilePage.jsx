import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useCallback, useEffect, useState } from "react";
import {
  ActionSheetIOS,
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Config from "react-native-config";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";

const EditProfilePage = ({ route, navigation }) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const { user, onSave } = route.params;
  const { token } = useAuth();
  const BACKEND = Config.BACKEND_URL || "https://law-ai-7y05.onrender.com";

  const [editForm, setEditForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    profileImage: user?.profileImage || null,
  });

  const [loading, setLoading] = useState(false);
  const [imageChanged, setImageChanged] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (user) {
      setEditForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        profileImage: user.profileImage || null,
      });
    }
  }, [user]);

  useEffect(() => {
    const hasChanges =
      editForm.firstName !== (user?.firstName || "") ||
      editForm.lastName !== (user?.lastName || "") ||
      imageChanged;
    setHasUnsavedChanges(hasChanges);
  }, [editForm, user, imageChanged]);

  const dummyProfile = useCallback(() => {
    const fn = editForm.firstName?.charAt(0)?.toUpperCase() || "";
    const ln = editForm.lastName?.charAt(0)?.toUpperCase() || "";
    return fn + ln;
  }, [editForm.firstName, editForm.lastName]);

  const api = {
    updateProfileInfo: async (firstName, lastName) => {
      console.log(firstName, lastName);
      console.log(BACKEND);
      console.log(token);
      try {
        const response = await fetch(`${BACKEND}/api/profile/info`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            firstName: firstName,
            lastName: lastName,
          }),
        });

        const responseText = await response.text();
        console.log("Update profile response:", responseText);

        if (!response.ok) {
          const errorData = responseText ? JSON.parse(responseText) : {};
          throw new Error(errorData.message || "Failed to update profile");
        }

        // Try to parse as JSON, if it fails, assume success
        try {
          return JSON.parse(responseText);
        } catch (parseError) {
          console.log("Response is not JSON, assuming success");
          return { success: true };
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        throw error;
      }
    },

    uploadProfileImage: async (imageUri) => {
      try {
        const formData = new FormData();
        const filename = imageUri.split("/").pop();
        const fileType = filename.split(".").pop().toLowerCase();

        // Validate file type
        const allowedTypes = ["jpg", "jpeg", "png", "gif", "webp"];
        if (!allowedTypes.includes(fileType)) {
          throw new Error(
            "Please select a valid image file (JPG, PNG, GIF, or WebP)"
          );
        }

        formData.append("image", {
          uri: imageUri,
          name: filename,
          type: `image/${fileType === "jpg" ? "jpeg" : fileType}`,
        });

        const response = await fetch(`${BACKEND}/api/profile/upload-image`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            // Don't set Content-Type header for FormData
          },
          body: formData,
        });

        const responseText = await response.text();
        console.log("Upload image response:", responseText);

        if (!response.ok) {
          const errorData = responseText ? JSON.parse(responseText) : {};
          throw new Error(errorData.message || "Failed to upload image");
        }

        // Try to parse as JSON
        try {
          return JSON.parse(responseText);
        } catch (parseError) {
          console.log("Upload response is not JSON, assuming success");
          return { success: true, profileImage: imageUri };
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
      }
    },

    deleteProfileImage: async () => {
      try {
        const response = await fetch(`${BACKEND}/api/profile/remove-image`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          const responseText = await response.text();
          const errorData = responseText ? JSON.parse(responseText) : {};
          throw new Error(
            errorData.message || "Failed to remove profile image"
          );
        }

        return { success: true };
      } catch (error) {
        console.error("Error removing profile image:", error);
        throw error;
      }
    },
  };

  const selectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Sorry, we need camera roll permissions to select images."
      );
      return;
    }

    const options = [
      "Take Photo",
      "Choose from Library",
      "Remove Photo",
      "Cancel",
    ];
    const destructiveButtonIndex = 2;
    const cancelButtonIndex = 3;

    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          destructiveButtonIndex,
          cancelButtonIndex,
        },
        (buttonIndex) => {
          handleImageSelection(buttonIndex);
        }
      );
    } else {
      Alert.alert("Select Profile Photo", "Choose an option", [
        { text: "Take Photo", onPress: () => handleImageSelection(0) },
        { text: "Choose from Library", onPress: () => handleImageSelection(1) },
        {
          text: "Remove Photo",
          onPress: () => handleImageSelection(2),
          style: "destructive",
        },
        { text: "Cancel", onPress: () => {}, style: "cancel" },
      ]);
    }
  };

  const handleImageSelection = async (buttonIndex) => {
    let result;

    switch (buttonIndex) {
      case 0: // Take Photo
        const cameraPermission =
          await ImagePicker.requestCameraPermissionsAsync();
        if (cameraPermission.status !== "granted") {
          Alert.alert(
            "Permission Required",
            "Sorry, we need camera permissions to take photos."
          );
          return;
        }

        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
        break;
      case 1: // Choose from Library
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
        break;
      case 2: // Remove Photo
        setEditForm((prev) => ({ ...prev, profileImage: null }));
        setImageChanged(true);
        return;
      default:
        return;
    }

    if (result && !result.canceled && result.assets?.[0]) {
      setEditForm((prev) => ({
        ...prev,
        profileImage: result.assets[0].uri,
      }));
      setImageChanged(true);
    }
  };

  const validateForm = () => {
    const errors = [];
    if (!editForm.firstName.trim()) errors.push("First name is required");
    if (!editForm.lastName.trim()) errors.push("Last name is required");
    if (editForm.firstName.trim().length < 2)
      errors.push("First name must be at least 2 characters");
    if (editForm.lastName.trim().length < 2)
      errors.push("Last name must be at least 2 characters");
    return errors;
  };

  const handleSave = async () => {
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      Alert.alert("Validation Error", validationErrors.join("\n"));
      return;
    }

    setLoading(true);

    try {
      let updatedData = {
        firstName: editForm.firstName.trim(),
        lastName: editForm.lastName.trim(),
        profileImage: editForm.profileImage,
      };

      // Update profile info
      await api.updateProfileInfo(editForm.firstName, editForm.lastName);

      // Handle image operations
      if (imageChanged) {
        if (editForm.profileImage === null) {
          // Remove image if it was deleted
          if (user?.profileImage) {
            await api.deleteProfileImage();
          }
          updatedData.profileImage = null;
        } else if (
          editForm.profileImage &&
          (editForm.profileImage.startsWith("file://") ||
            editForm.profileImage.startsWith("ph://") ||
            editForm.profileImage.startsWith("content://"))
        ) {
          // Upload new image if it's a local file
          const imageResult = await api.uploadProfileImage(
            editForm.profileImage
          );
          updatedData.profileImage =
            imageResult.profileImage ||
            imageResult.imageUrl ||
            editForm.profileImage;
        }
      }

      // Call the parent's onSave callback
      onSave(updatedData);
      navigation.goBack();
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to update profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const renderProfileImage = () => {
    if (editForm.profileImage) {
      return (
        <Image
          source={{ uri: editForm.profileImage }}
          style={styles.profileImage}
          onError={(error) => {
            console.log("Image load error:", error);
            setEditForm((prev) => ({ ...prev, profileImage: null }));
          }}
        />
      );
    } else {
      return (
        <View
          style={[
            styles.profileInitials,
            { backgroundColor: colors.cardBackground },
          ]}
        >
          <Text style={[styles.initialsText, { color: colors.textSecondary }]}>
            {dummyProfile() || "?"}
          </Text>
        </View>
      );
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <View style={[styles.header]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Edit Profile
        </Text>

        <View style={styles.headerButton} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Img */}
        <View style={styles.profileImageSection}>
          <TouchableOpacity
            style={styles.profileImageContainer}
            onPress={selectImage}
            disabled={loading}
          >
            {renderProfileImage()}

            <View
              style={[
                styles.cameraButton,
                {
                  backgroundColor: colors.primary,
                  borderColor: colors.background,
                },
              ]}
            >
              <Ionicons name="camera" size={16} color="white" />
            </View>
          </TouchableOpacity>

          <Text
            style={[styles.profileImageText, { color: colors.textSecondary }]}
          >
            Tap to change profile photo
          </Text>
        </View>

        {/* Form */}
        {[
          {
            label: "First Name",
            key: "firstName",
            placeholder: "Enter first name",
          },
          {
            label: "Last Name",
            key: "lastName",
            placeholder: "Enter last name",
          },
        ].map(({ label, key, placeholder }) => (
          <View style={styles.inputGroup} key={key}>
            <Text style={[styles.inputLabel, { color: colors.textTertiary }]}>
              {label} <Text style={{ color: colors.error }}></Text>
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: colors.surface,
                  color: colors.text,
                },
              ]}
              value={editForm[key]}
              placeholder={placeholder}
              placeholderTextColor={colors.textSecondary}
              onChangeText={(text) =>
                setEditForm((prev) => ({ ...prev, [key]: text }))
              }
              editable={!loading}
              maxLength={50}
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>
        ))}
      </ScrollView>

      {/* save btn */}
      <View
        style={[styles.bottomContainer, { backgroundColor: colors.background }]}
      >
        <TouchableOpacity
          style={[
            styles.saveButtonBottom,
            {
              backgroundColor: loading ? colors.border : colors.secondary,
              opacity: loading || !hasUnsavedChanges ? 0.6 : 1,
            },
          ]}
          onPress={handleSave}
          disabled={loading || !hasUnsavedChanges}
        >
          {loading ? (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <ActivityIndicator
                color="white"
                size="small"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.saveButtonText}>Saving...</Text>
            </View>
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default EditProfilePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerButton: {
    minWidth: 60,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  bottomContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  saveButtonBottom: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  profileImageSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 8,
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 80,
  },
  profileInitials: {
    width: 140,
    height: 140,
    borderRadius: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  initialsText: {
    fontSize: 36,
    fontWeight: "600",
    color: "white",
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
  },
  profileImageText: {
    fontSize: 14,
    textAlign: "center",
    opacity: 0.5,
  },
  inputGroup: {
    marginBottom: 22,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    marginLeft: 4,
  },
  textInput: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
});
