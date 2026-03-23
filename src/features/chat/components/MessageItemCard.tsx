import { MessageItem } from "@/src/features/chat/types";
import { formatTime } from "@/src/shared/utils";
import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";

interface MessageItemCardProps {
  item: MessageItem;
  partnerAvatar?: string;
}

const DEFAULT_AVATAR = "https://i.pravatar.cc/150?u=a04258a2462d826712d";

export const MessageItemCard = ({
  item,
  partnerAvatar,
}: MessageItemCardProps) => {
  const [showTime, setShowTime] = useState(false);
  const messageContent = item.content?.trim() || "...";

  const avatarSource = partnerAvatar?.trim()
    ? { uri: partnerAvatar }
    : { uri: DEFAULT_AVATAR };

  const handlePress = () => {
    setShowTime((prev) => !prev);
  };

  return (
    <Pressable onPress={handlePress}>
      <View
        className={`mb-3 flex-row ${item.isMine ? "justify-end" : "justify-start"}`}
      >
        {/* Partner Avatar -  for messages not mine */}
        {!item.isMine && (
          <Image
            source={avatarSource}
            className="rounded-full mr-2"
            style={{ width: 32, height: 32 }}
            resizeMode="cover"
          />
        )}

        {/* Message Bubble and Time Container */}
        <View
          className={`${item.isMine ? "items-end" : "items-start"}`}
          style={{ maxWidth: "78%" }}
        >
          <View
            className={`rounded-lg px-4 py-2 ${
              item.isMine ? "bg-primary" : "bg-slate-100"
            }`}
            style={{ minWidth: 80 }}
          >
            <Text
              className={`text-base ${item.isMine ? "text-white" : "text-slate-900"}`}
              style={{ flexShrink: 1 }}
            >
              {messageContent}
            </Text>
          </View>

          {/* Time below the message card */}
          {showTime && (
            <Text className="text-xs mt-1 text-slate-500">
              {formatTime(new Date(item.createdAt), {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
};
