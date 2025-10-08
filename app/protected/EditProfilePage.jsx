import { BACKEND } from "@/constants/backend";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ChangeProfile from "../../components/settings/ChangeProfile";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";

const EditProfilePage = ({ route, navigation }) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const { user, onSave } = route.params;
  const { token } = useAuth();

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
      const response = await fetch(`${BACKEND}/api/profile/info`, {
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
        } catch {}
        throw new Error(err.message || "Failed to update profile info");
      }

      try {
        return JSON.parse(text);
      } catch {
        return { success: true };
      }
    },

    uploadProfileImage: async (imageParam) => {
      if (!imageParam) throw new Error("No image provided");

      const isObject = typeof imageParam === "object" && imageParam.uri;
      const uri = isObject ? imageParam.uri : imageParam;
      if (!uri || typeof uri !== "string")
        throw new Error("Image uri is missing or invalid");

      const filename = isObject
        ? imageParam.name || uri.split("/").pop()
        : uri.split("/").pop();

      const ext = (filename?.split(".").pop() || "").toLowerCase();
      const allowed = ["jpg", "jpeg", "png", "gif", "webp"];
      if (!allowed.includes(ext))
        throw new Error(
          "Please select a valid image file (JPG, PNG, GIF, or WebP)"
        );

      const mime =
        (isObject && imageParam.type) ||
        `image/${ext === "jpg" ? "jpeg" : ext}`;

      const formData = new FormData();
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
        },
        body: formData,
      });

      const responseText = await response.text();
      if (!response.ok) {
        let err = {};
        try {
          err = responseText ? JSON.parse(responseText) : {};
        } catch {}
        throw new Error(
          err.message || `Failed to upload image (status ${response.status})`
        );
      }

      try {
        return JSON.parse(responseText);
      } catch {
        return { success: true, profileImage: uri };
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

  const handleSaveName = async () => {
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      Alert.alert("Validation Error", validationErrors.join("\n"));
      return;
    }

    await api.updateProfileInfo(
      editForm.firstName.trim(),
      editForm.lastName.trim()
    );
  };

  const handleSaveImage = async () => {
    const imageToUpload = editForm.profileImage;
    const isLocal =
      (typeof imageToUpload === "string" &&
        (imageToUpload.startsWith("file://") ||
          imageToUpload.startsWith("content://") ||
          imageToUpload.startsWith("ph://"))) ||
      (typeof imageToUpload === "object" && imageToUpload.uri);

    if (!isLocal) return editForm.profileImage;

    const imageResult = await api.uploadProfileImage(imageToUpload);
    return (
      imageResult.profileImage || imageResult.imageUrl || editForm.profileImage
    );
  };

  /** ─── Combined Save Logic ─────────────────────────────────────── */
  const handleSave = async () => {
    setLoading(true);
    try {
      let updatedData = {
        firstName: editForm.firstName.trim(),
        lastName: editForm.lastName.trim(),
        profileImage: editForm.profileImage,
      };

      // update name
      await handleSaveName();

      // update image if changed
      if (imageChanged) {
        const uploadedUrl = await handleSaveImage();
        updatedData.profileImage = uploadedUrl;
      }

      onSave(updatedData);
      navigation.goBack();
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      Alert.alert("Error", error.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <View style={styles.header}>
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
          { label: "First Name", key: "firstName" },
          { label: "Last Name", key: "lastName" },
        ].map(({ label, key }) => (
          <View style={styles.inputGroup} key={key}>
            <Text style={[styles.inputLabel, { color: colors.textTertiary }]}>
              {label}
            </Text>
            <TextInput
              style={[
                styles.textInput,
                { backgroundColor: colors.surface, color: colors.text },
              ]}
              value={editForm[key]}
              placeholder={`Enter ${label.toLowerCase()}`}
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

      {/* Save Button */}
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
