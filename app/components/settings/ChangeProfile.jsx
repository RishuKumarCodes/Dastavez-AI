import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useCallback } from "react";
import {
  ActionSheetIOS,
  Alert,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
const ChangeProfile = ({ editForm, setEditForm, setImageChanged, colors }) => {
  const dummyProfile = useCallback(() => {
    const fn = editForm.firstName?.charAt(0)?.toUpperCase() || "";
    const ln = editForm.lastName?.charAt(0)?.toUpperCase() || "";
    return fn + ln;
  }, [editForm.firstName, editForm.lastName]);

  const selectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Sorry, we need camera roll permissions to select images."
      );
      return;
    }

    const options = ["Take Photo", "Choose from Library", "Cancel"];
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
        { text: "Cancel", onPress: () => {}, style: "cancel" },
      ]);
    }
  };

  const handleImageSelection = async (buttonIndex) => {
    let result;

    switch (buttonIndex) {
      case 0: // Take Photo
        {
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
        }
        break;
      case 1: // Choose from Library
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
        break;
      default:
        return;
    }

    // expo-image-picker result structure: { canceled: boolean, assets: [{ uri, fileName?, type? }] }
    if (result && !result.canceled && result.assets?.[0]) {
      const asset = result.assets[0];
      const uri = asset.uri;
      // filename fallback
      const fallbackName = uri.split("/").pop();
      const name = asset.fileName || fallbackName || `photo_${Date.now()}.jpg`;

      // type fallback (asset.type might not be always present)
      let type = asset.type; // e.g. "image"
      // Try to derive from extension
      if (!type) {
        const ext = (name.split(".").pop() || "").toLowerCase();
        if (ext) type = `image/${ext === "jpg" ? "jpeg" : ext}`;
      } else {
        // asset.type might be "image" -> make it "image/jpeg"
        if (!type.includes("/")) type = `${type}/jpeg`;
      }

      // final fallback
      if (!type) type = "image/jpeg";

      // update form: store both preview uri and file object for upload
      setEditForm((prev) => ({
        ...prev,
        profileImage: uri,
        profileImageFile: { uri, name, type },
      }));
      setImageChanged(true);
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
    <View style={styles.profileImageSection}>
      <TouchableOpacity
        style={styles.profileImageContainer}
        onPress={selectImage}
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

      <Text style={[styles.profileImageText, { color: colors.textSecondary }]}>
        Tap to change profile photo
      </Text>
    </View>
  );
};

export default ChangeProfile;

const styles = StyleSheet.create({
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
    opacity: 0.6,
  },
});
