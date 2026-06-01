import { useQnAStore } from "@/src/features/post/store";
import { MenuBottomSheet } from "@/src/shared/components/ui/MenuBottomSheet";
import { toast } from "@/src/shared/components/ui/toast";
import { ensureMediaPermission } from "@/src/shared/services";
import { CAMERA_OPTIONS, PICKER_OPTIONS } from "@/src/shared/store";
import {
  launchCameraAsync,
  launchImageLibraryAsync,
  requestCameraPermissionsAsync,
} from "expo-image-picker";
import { CameraIcon, ImageIcon } from "phosphor-react-native";
import React from "react";

export const QnAImagePickerSheet = () => {
  const isPickerSheetVisible = useQnAStore(
    (state) => state.isPickerSheetVisible,
  );
  const closePickerSheet = useQnAStore((state) => state.closePickerSheet);
  const addImagesToActiveQuestion = useQnAStore(
    (state) => state.addImagesToActiveQuestion,
  );

  const openGallery = async () => {
    closePickerSheet();
    const granted = await ensureMediaPermission();

    if (!granted) {
      toast.error("Media library permission is required to pick photos.");
      return;
    }

    const result = await launchImageLibraryAsync(PICKER_OPTIONS);
    if (result.canceled || result.assets.length === 0) return;

    addImagesToActiveQuestion(result.assets);
  };

  const takePhoto = async () => {
    closePickerSheet();
    const { status } = await requestCameraPermissionsAsync();

    if (status !== "granted") {
      toast.error("Camera permission is required to take photos.");
      return;
    }

    const result = await launchCameraAsync(CAMERA_OPTIONS);
    if (result.canceled || result.assets.length === 0) return;

    addImagesToActiveQuestion(result.assets);
  };

  return (
    <MenuBottomSheet
      isVisible={isPickerSheetVisible}
      onClose={closePickerSheet}
      options={[
        {
          id: "gallery",
          label: "Open Gallery",
          description: "Pick from your photo library",
          icon: ImageIcon,
          onPress: openGallery,
        },
        {
          id: "camera",
          label: "Take Photo",
          description: "Use your camera",
          icon: CameraIcon,
          onPress: takePhoto,
        },
      ]}
    />
  );
};
