import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Config from "react-native-config";
import ChangeProfile from "../../components/settings/ChangeProfile";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";

const EditProfilePage = ({ route, navigation }) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const { user, onSave } = route.params;
  const { token } = useAuth();
  const BACKEND = Config.BACKEND_URL || "http://34.68.115.157:5000";

  const [editForm, setEditForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    profileImage: user?.profileImage || null,
    profileImageFile: null,
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
        profileImageFile: null,
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

  const api = {
    updateProfileInfo: async (firstName, lastName) => {
      try {
        const response = await fetch(`${BACKEND}/api/profile/update`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ firstName, lastName }),
        });

        const text = await response.text();
        if (!response.ok) {
          let err = {};
          try {
            err = text ? JSON.parse(text) : {};
          } catch (e) {
            console.log("updateProfileInfo non-json:", text);
          }
          throw new Error(err.message || "Failed to update profile info");
        }
        try {
          return JSON.parse(text);
        } catch {
          return { success: true };
        }
      } catch (error) {
        console.error("Error updating profile info:", error);
        throw error;
      }
    },

    uploadProfileImage: async (imageParam) => {
      try {
        if (!imageParam) throw new Error("No image provided");

        // extract uri, name, type in a safe way
        const isObject = typeof imageParam === "object" && imageParam.uri;
        const uri = isObject ? imageParam.uri : imageParam;
        if (!uri || typeof uri !== "string") {
          throw new Error("Image uri is missing or invalid");
        }

        const filename = isObject
          ? imageParam.name || uri.split("/").pop()
          : uri.split("/").pop();

        const ext = (filename?.split(".").pop() || "").toLowerCase();
        const allowed = ["jpg", "jpeg", "png", "gif", "webp"];
        if (!allowed.includes(ext)) {
          throw new Error(
            "Please select a valid image file (JPG, PNG, GIF, or WebP)"
          );
        }

        const mime =
          (isObject && imageParam.type) ||
          `image/${ext === "jpg" ? "jpeg" : ext}`;

        const formData = new FormData();

        // On Android it's okay to pass file:// URIs.
        // Use the uri as-is — the backend or expo will handle it.
        formData.append("profileImage", {
          uri,
          name: filename,
          type: mime,
        });

        const response = await fetch(`${BACKEND}/api/profile/profile-image`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            // DO NOT set Content-Type for FormData
          },
          body: formData,
        });

        const responseText = await response.text();
        console.log("uploadProfileImage status:", response.status);
        console.log("uploadProfileImage body:", responseText);

        if (!response.ok) {
          let err = {};
          try {
            err = responseText ? JSON.parse(responseText) : {};
          } catch {
            console.log("uploadProfileImage: response not JSON");
          }
          throw new Error(
            err.message || `Failed to upload image (status ${response.status})`
          );
        }

        try {
          return JSON.parse(responseText);
        } catch {
          return { success: true, profileImage: uri };
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
      }
    },
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

      await api.updateProfileInfo(editForm.firstName, editForm.lastName);

      if (imageChanged) {
        // If we have a file object use that, otherwise fall back to uri string
        const imageToUpload = editForm.profileImage;
        // Only upload if it's a local file uri or a file object (not a remote already uploaded URL)
        const isLocal =
          (typeof imageToUpload === "string" &&
            (imageToUpload.startsWith("file://") ||
              imageToUpload.startsWith("content://") ||
              imageToUpload.startsWith("ph://"))) ||
          (typeof imageToUpload === "object" && imageToUpload.uri);

        if (isLocal) {
          const imageResult = await api.uploadProfileImage(imageToUpload);
          updatedData.profileImage =
            imageResult.profileImage ||
            imageResult.imageUrl ||
            editForm.profileImage;
        } else {
          // it might be a remote URL (no upload needed)
          updatedData.profileImage = editForm.profileImage;
        }
      }

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
        <ChangeProfile
          editForm={editForm}
          setEditForm={setEditForm}
          imageChanged={imageChanged}
          setImageChanged={setImageChanged}
          colors={colors}
        />

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

      {/* Save */}
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
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerButton: { minWidth: 60 },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    flex: 1,
  },
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 24 },
  bottomContainer: { paddingHorizontal: 16, paddingVertical: 16 },
  saveButtonBottom: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: { color: "white", fontSize: 16, fontWeight: "600" },
  inputGroup: { marginBottom: 22 },
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
