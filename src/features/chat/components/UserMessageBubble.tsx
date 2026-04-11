import type { UserMessage } from "@/src/features/chat/types";
import { AppUserAvatar } from "@/src/shared/components/AppUserAvatar";
import { formatTime } from "@/src/shared/utils";
import React, { useMemo } from "react";
import { Text, View } from "react-native";

type MessageBubbleProps = {
  message: UserMessage;
  isOwnMessage: boolean;
  isTopOfGroup: boolean;
  isBottomOfGroup: boolean;
  partnerAvatarUrl: string | null | undefined;
};

export const UserMessageBubble = ({
  message,
  isOwnMessage,
  isTopOfGroup,
  isBottomOfGroup,
  partnerAvatarUrl,
}: MessageBubbleProps) => {
  const messageTime = useMemo(
    () =>
      formatTime(new Date(message.createdAt), {
        hour: "2-digit",
        minute: "2-digit",
      }),
    [message.createdAt],
  );

  const bubbleRounding = isBottomOfGroup
    ? isOwnMessage
      ? "rounded-md rounded-br-xs"
      : "rounded-md rounded-bl-xs"
    : "rounded-md";

  const bubbleColor = isOwnMessage ? "bg-secondary/90 " : "bg-muted/90";
  const textColor = isOwnMessage ? "text-white" : "text-textPrimary";

  return (
    <View className={`w-full ${isOwnMessage ? "items-end" : "items-start"}`}>
      {isTopOfGroup && isOwnMessage && (
        <View className="pb-xxs px-sm">
          <Text className="text-xs text-textSecondary font-sm">
            {messageTime}
          </Text>
        </View>
      )}

      {isTopOfGroup && !isOwnMessage && (
        <View className="pb-xxs px-2xl">
          <Text className="text-xs text-textSecondary font-sm">
            {messageTime}
          </Text>
        </View>
      )}

      <View
        className={`flex-row items-end ${isOwnMessage ? "justify-end" : "justify-start"} max-w-[75%] gap-xs`}
      >
        {!isOwnMessage &&
          (isBottomOfGroup ? (
            <AppUserAvatar avatarUrl={partnerAvatarUrl} size={28} />
          ) : (
            <View style={{ width: 28 }} />
          ))}

        <View className="flex-shrink ">
          <View className={`px-md py-sm ${bubbleRounding} ${bubbleColor}`}>
            <Text className={`text-normal font-thin leading-5 ${textColor}`}>
              {message.content}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
