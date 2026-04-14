import { AppLoader } from "@/src/shared/components";
import { TouchableIconButton } from "@/src/shared/components/ui/TouchableIconButton";
import { toast } from "@/src/shared/components/ui/toast";
import { useUploadImage } from "@/src/shared/hooks";
import { ensureMediaPermission } from "@/src/shared/services";
import { colors } from "@/src/shared/theme";
import {
  launchCameraAsync,
  launchImageLibraryAsync,
  requestCameraPermissionsAsync,
  type ImagePickerAsset,
  type ImagePickerOptions,
} from "expo-image-picker";
import {
  ArrowUpIcon,
  CameraIcon,
  ImageIcon,
  PlusCircleIcon,
} from "phosphor-react-native";
import React, { useState } from "react";
import { TextInput, View } from "react-native";

type MessageInputProps = {
  onSend: (message: string) => Promise<void>;
  onSendImage: (imageUrl: string) => Promise<void>;
  isSending?: boolean;
};

const PICKER_OPTIONS: ImagePickerOptions = {
  mediaTypes: ["images"],
  quality: 1,
  allowsMultipleSelection: false,
};

export const MessageInput = ({
  onSend,
  onSendImage,
  isSending,
}: MessageInputProps) => {
  const [messageText, setMessageText] = useState("");
  const { uploadImages, isUploadingImages } = useUploadImage();

  const handleSend = async () => {
    if (!messageText.trim() || isSending) return;

    const currentMessage = messageText.trim();
    setMessageText("");

    try {
      await onSend(currentMessage);
    } catch (error) {
      setMessageText(currentMessage);
      console.log("Error sending message:", error);
    }
  };

  const uploadAndSend = async (uri: string) => {
    // useUploadImage only reads .uri from each asset, cast is safe
    const results = await uploadImages([{ uri } as ImagePickerAsset]);
    const downloadURL = results?.[0]?.downloadURL;
    if (!downloadURL) throw new Error("Upload returned no URL");
    await onSendImage(downloadURL);
  };

  const handleUploadImage = async () => {
    const hasPermission = await ensureMediaPermission();
    if (!hasPermission) return;

    const result = await launchImageLibraryAsync(PICKER_OPTIONS);
    if (result.canceled || !result.assets[0]?.uri) return;

    try {
      await uploadAndSend(result.assets[0].uri);
    } catch {
      toast.error("Failed to upload image. Please try again.");
    }
  };

  const handleTakePhoto = async () => {
    const { status } = await requestCameraPermissionsAsync();
    if (status !== "granted") {
      toast.error("Camera permission is required to take photos.");
      return;
    }

    const result = await launchCameraAsync(PICKER_OPTIONS);
    if (result.canceled || !result.assets[0]?.uri) return;

    try {
      await uploadAndSend(result.assets[0].uri);
    } catch {
      toast.error("Failed to upload photo. Please try again.");
    }
  };

  const handlePlusAction = async () => {
    console.log("Plus action triggered...");
  };

  const isMediaDisabled = isUploadingImages || !!isSending;

  return (
    <View className="flex-row items-center gap-md bg-surface px-md py-sm border-t border-muted shadow-t-sm">
      <View className="flex-row items-center gap-md">
        {/* Plus Button */}
        <TouchableIconButton
          icon={
            <PlusCircleIcon size={28} color={colors.secondary} weight="fill" />
          }
          onPress={handlePlusAction}
        />

        {/* Uploading indicator replaces camera + image buttons */}
        {isUploadingImages ? (
          <AppLoader dotSize={5} colorClass="bg-secondary" bounceHeight={4} />
        ) : (
          <>
            {/* Camera Button */}
            <TouchableIconButton
              disabled={isMediaDisabled}
              icon={
                <CameraIcon
                  size={28}
                  color={isMediaDisabled ? colors.text.muted : colors.secondary}
                  weight="fill"
                />
              }
              onPress={handleTakePhoto}
            />

            {/* Image Library Button */}
            <TouchableIconButton
              disabled={isMediaDisabled}
              icon={
                <ImageIcon
                  size={28}
                  color={isMediaDisabled ? colors.text.muted : colors.secondary}
                  weight="fill"
                />
              }
              onPress={handleUploadImage}
            />
          </>
        )}
      </View>

      {/* Message Input */}
      <TextInput
        value={messageText}
        onChangeText={setMessageText}
        placeholder="Aa"
        multiline
        numberOfLines={2}
        className="rounded-lg text-textPrimary text-base font-thin leading-5 flex-1 px-md py-sm justify-center bg-muted"
        textAlignVertical="center"
        placeholderTextColor={colors.text.muted}
        cursorColor={colors.black}
        selectionColor={colors.black}
      />

      {/* Send Button */}
      <View
        className="p-sm rounded-full bg-secondary"
        style={{
          opacity: !messageText.trim() || isSending ? 0.4 : 1,
        }}
      >
        <TouchableIconButton
          disabled={!messageText.trim() || isSending}
          icon={<ArrowUpIcon size={16} color={colors.white} weight="regular" />}
          onPress={handleSend}
        />
      </View>
    </View>
  );
};
