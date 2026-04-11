import { TouchableIconButton } from "@/src/shared/components/ui/TouchableIconButton";
import { colors } from "@/src/shared/theme";
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
    <View className="flex-row items-center gap-md bg-surface px-md py-sm border-t border-muted shadow-t-sm">
      <View className="flex-row items-center gap-md">
        {/* Plus Button */}
        <TouchableIconButton
          icon={
            <PlusCircleIcon size={28} color={colors.secondary} weight="fill" />
          }
          onPress={handlePlusAction}
        />

        {/* Camera Button */}
        <TouchableIconButton
          icon={<CameraIcon size={28} color={colors.secondary} weight="fill" />}
          onPress={handleTakePhoto}
        />

        {/* Image Upload Button */}
        <TouchableIconButton
          icon={<ImageIcon size={28} color={colors.secondary} weight="fill" />}
          onPress={handleUploadImage}
        />
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

      {/* Send Button  */}
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
