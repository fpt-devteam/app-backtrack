import {
  formatTime,
  ICON_SIZE,
} from "@/src/features/notification/components/NotificationRow/utils";
import type { UserNotification } from "@/src/features/notification/types";
import { colors } from "@/src/shared/theme";
import { ChatsIcon } from "phosphor-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  notification: UserNotification;
  onPress: (notification: UserNotification) => void;
};

export const ChatEventNotificationRow = ({ notification, onPress }: Props) => {
  const isUnread = notification.status === "Unread";

  return (
    <TouchableOpacity
      onPress={() => onPress(notification)}
      className="flex-row items-start gap-sm px-sm py-md2 border-b border-divider"
      style={{
        backgroundColor: isUnread ? colors.accent : colors.surface,
      }}
    >
      <View className="w-12 aspect-square items-center justify-center">
        <ChatsIcon size={ICON_SIZE} color={colors.status.info} weight="fill" />
      </View>

      <View className="flex-1 min-w-0">
        <View className="flex-row items-start justify-between gap-xs">
          <Text
            className="flex-1 text-base leading-5 font-normal text-textPrimary"
            numberOfLines={1}
          >
            {notification.title ?? "New message"}
          </Text>

          <Text className="text-sm font-normal text-textPrimary">
            {formatTime(notification.sentAt)}
          </Text>
        </View>

        <Text
          className="text-sm font-thin text-textSecondary"
          numberOfLines={2}
        >
          {notification.body}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
