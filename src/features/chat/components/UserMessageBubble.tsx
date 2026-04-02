import { useAppUser } from "@/src/features/auth/providers";
import type { UserMessage } from "@/src/features/chat/types";
import { formatTime } from "@/src/shared/utils";
import React, { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";

type MessageBubbleProps = {
  message: UserMessage;
};

export const UserMessageBubble = ({ message }: MessageBubbleProps) => {
  const { user } = useAppUser();
  const [isFocused, setIsFocused] = useState(false);

  const isOwnMessage = useMemo(
    () => message.senderId === user?.id,
    [message.senderId, user?.id],
  );

  const messageTime = useMemo(
    () =>
      formatTime(new Date(message.createdAt), {
        hour: "2-digit",
        minute: "2-digit",
      }),
    [message.createdAt],
  );

  return (
    <View className={`w-full  ${isOwnMessage ? "items-end" : "items-start"}`}>
      <Pressable
        onPress={() => setIsFocused(!isFocused)}
        className={`max-w-[75%] active:opacity-70 ${isFocused ? "opacity-85" : "opacity-100"}`}
      >
        <View
          className={`
            px-4 py-2 rounded-[18px]
            ${
              isOwnMessage
                ? "bg-primary rounded-br-[4px]"
                : "bg-slate-200 rounded-bl-[4px]"
            }
          `}
        >
          <Text
            className={`text-[16px] leading-5 ${
              isOwnMessage ? "text-white" : "text-textPrimary"
            }`}
          >
            {message.content}
          </Text>
        </View>
      </Pressable>

      {isFocused && (
        <View className="mt-1 mx-2">
          <Text className="text-[11px] text-textSecondary font-medium">
            {messageTime}
          </Text>
        </View>
      )}
    </View>
  );
};
