import type { UserNotification } from "@/src/features/notification/types";
import { cn } from "@/src/shared/utils/cn";
import React from "react";
import { Pressable, Text, View } from "react-native";

type NotificationRowProps = {
  mode: "normal" | "candidate";
  notification: UserNotification;
  isSelected?: boolean;
  onLongPress: (notification: UserNotification) => void;
  onPress?: (notification: UserNotification) => void;
  onToggleSelect?: (id: string) => void;
};

const formatTime = (date: Date): string => {
  const now = new Date();
  const notifDate = new Date(date);
  const diffMs = now.getTime() - notifDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;

  const day = notifDate.getDate().toString().padStart(2, "0");
  const month = (notifDate.getMonth() + 1).toString().padStart(2, "0");
  return `${day}/${month}`;
};

export const NotificationRow = ({
  mode,
  notification,
  isSelected = false,
  onLongPress,
  onPress,
  onToggleSelect,
}: NotificationRowProps) => {
  const isUnread = notification.status === "Unread";

  const handlePress = () => {
    if (mode === "candidate") {
      onToggleSelect?.(notification.id);
    } else {
      onPress?.(notification);
    }
  };

  const handleLongPress = () => {
    if (mode === "normal") {
      onLongPress(notification);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      onLongPress={handleLongPress}
      hitSlop={{ top: 8, bottom: 8, left: 16, right: 16 }}
      className={cn(
        "flex-row items-start gap-3 px-4 py-3 bg-white border-b border-slate-100",
        mode === "candidate" && isSelected && "bg-sky-50",
      )}
      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
    >
      {/* Left: Indicator or Checkbox */}
      <View className="pt-1">
        {mode === "normal" && isUnread && (
          <View className="w-2 h-2 rounded-full bg-sky-500 mt-1" />
        )}
        {mode === "normal" && !isUnread && (
          <View className="w-8 h-8 rounded-full bg-slate-100" />
        )}
        {mode === "candidate" && isSelected && (
          <View className="w-6 h-6 rounded-full bg-sky-500 items-center justify-center">
            <Text className="text-white text-xs">✓</Text>
          </View>
        )}
        {mode === "candidate" && !isSelected && (
          <View className="w-6 h-6 rounded-full border-2 border-slate-300" />
        )}
      </View>

      {/* Center: Content */}
      <View className="flex-1 min-w-0 gap-1">
        <Text
          className={cn(
            "text-base",
            isUnread ? "font-semibold text-slate-900" : "text-slate-700",
          )}
          numberOfLines={1}
        >
          {notification.title}
        </Text>
        <Text className="text-sm text-slate-500" numberOfLines={2}>
          {notification.body}
        </Text>
      </View>

      {/* Right: Time */}
      <Text className="text-xs text-slate-400 pt-1">
        {formatTime(notification.sentAt)}
      </Text>
    </Pressable>
  );
};
