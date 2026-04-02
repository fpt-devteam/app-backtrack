import { TouchableIconButton } from "@/src/shared/components/ui/TouchableIconButton";
import { colors } from "@/src/shared/theme";
import {
  CameraIcon,
  ImageIcon,
  PaperPlaneRightIcon,
  PlusCircleIcon,
} from "phosphor-react-native";
import React, { useState } from "react";
import { TextInput, View } from "react-native";

type MessageInputProps = {
  onSend: (message: string) => Promise<void>;
  isSending?: boolean;
};

export const MessageInput = ({ onSend, isSending }: MessageInputProps) => {
  const [messageText, setMessageText] = useState("");

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

  const handleUploadImage = async () => {
    console.log("Uploading image...");
  };

  const handleTakePhoto = async () => {
    console.log("Taking photo...");
  };

  const handlePlusAction = async () => {
    console.log("Plus action triggered...");
  };

  return (
    <View className="flex-row items-center gap-4 px-4 mb-2 bg-canvas">
      <View className="flex-row items-center gap-4  ">
        {/* Plus Button */}
        <TouchableIconButton
          icon={
            <PlusCircleIcon size={28} color={colors.primary} weight="fill" />
          }
          onPress={handlePlusAction}
        />

        {/* Camera Button */}
        <TouchableIconButton
          icon={<CameraIcon size={28} color={colors.primary} weight="fill" />}
          onPress={handleTakePhoto}
        />

        {/* Image Upload Button */}
        <TouchableIconButton
          icon={<ImageIcon size={28} color={colors.primary} weight="fill" />}
          onPress={handleUploadImage}
        />
      </View>

      {/* Message Input */}
      <TextInput
        value={messageText}
        onChangeText={setMessageText}
        placeholder="Aa"
        placeholderTextColor={colors.text.secondary}
        multiline
        className="min-h-touch rounded-full text-textPrimary text-base flex-1 px-4 py-3 justify-center bg-muted"
        textAlignVertical="center"
      />

      {/* Send Button  */}
      <TouchableIconButton
        disabled={!messageText.trim() || isSending}
        icon={
          <PaperPlaneRightIcon size={28} color={colors.primary} weight="fill" />
        }
        onPress={handleSend}
      />
    </View>
  );
};
