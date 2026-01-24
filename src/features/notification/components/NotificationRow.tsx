import type { NotificationItem } from "@/src/features/notification/types";
import { colors } from "@/src/shared/theme";
import { timeSincePast } from "@/src/shared/utils/datetime.utils";
import React, { useCallback, useMemo } from "react";
import { Pressable, Text, View } from "react-native";

type NotificationRowProps = {
  notification: NotificationItem;
  onPress: (notification: NotificationItem) => void;
  onLongPress: (notification: NotificationItem) => void;
};

export const NotificationRow = React.memo(
  ({ notification, onPress, onLongPress }: NotificationRowProps) => {
    const handlePress = useCallback(() => {
      onPress(notification);
    }, [notification, onPress]);

    const handleLongPress = useCallback(() => {
      onLongPress(notification);
    }, [notification, onLongPress]);

    const timeAgo = useMemo(
      () => timeSincePast(notification.createdAt),
      [notification.createdAt],
    );

    const getBackgroundColor = (pressed: boolean) => {
      if (notification.isRead) {
        return pressed ? colors.slate[50] : colors.white;
      }
      return pressed ? colors.blue[50] : colors.blue[25] || "#F0F9FF";
    };

    return (
      <Pressable
        onPress={handlePress}
        onLongPress={handleLongPress}
        delayLongPress={400}
        className="px-4 py-3 flex-row items-start"
        style={({ pressed }) => ({
          backgroundColor: getBackgroundColor(pressed),
          opacity: notification.isArchived ? 0.6 : 1,
        })}
      >
        {/* Left: Status Indicator */}
        <View className="pt-1 pr-3">
          {notification.isRead ? (
            <View className="w-2.5 h-2.5 rounded-full bg-transparent" />
          ) : (
            <View
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: colors.primary }}
            />
          )}
        </View>

        {/* Center: Content */}
        <View className="flex-1 pr-3">
          {notification.title && (
            <Text
              className="text-base mb-0.5"
              style={{
                color: colors.slate[900],
                fontWeight: notification.isRead ? "500" : "700",
              }}
              numberOfLines={2}
            >
              {notification.title}
            </Text>
          )}
          {notification.body && (
            <Text
              className="text-sm"
              style={{ color: colors.slate[600] }}
              numberOfLines={2}
            >
              {notification.body}
            </Text>
          )}
        </View>

        {/* Right: Time */}
        <View className="pt-0.5">
          <Text className="text-xs" style={{ color: colors.slate[500] }}>
            {timeAgo}
          </Text>
        </View>
      </Pressable>
    );
  },
);

NotificationRow.displayName = "NotificationRow";
