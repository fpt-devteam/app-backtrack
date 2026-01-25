import type { UserNotification } from "@/src/features/notification/types";
import { cn } from "@/src/shared/utils/cn";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

type NotificationRowProps = {
  mode: "normal" | "candidate";
  notification: UserNotification;
  isSelected?: boolean;
  onLongPress: (notification: UserNotification) => void;
  onPress?: (notification: UserNotification) => void;
  onToggleSelect?: (id: string) => void;
};

const formatTime = (date: Date | string): string => {
  const now = new Date();
  const notifDate = new Date(date);
  const diffMs = now.getTime() - notifDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${Math.max(diffMins, 1)}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;

  const day = notifDate.getDate().toString().padStart(2, "0");
  const month = (notifDate.getMonth() + 1).toString().padStart(2, "0");
  return `${day}/${month}`;
};

const DEFAULT_NOTIFICATION_IMAGE = require("@/assets/images/icon.png");
const AVATAR_SIZE = 40;

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
    if (mode === "candidate") onToggleSelect?.(notification.id);
    else onPress?.(notification);
  };

  const handleLongPress = () => {
    if (mode === "normal") onLongPress(notification);
  };

  const imageSource =
    typeof notification.data?.imageUrl === "string" &&
    notification.data.imageUrl.length > 0
      ? { uri: notification.data.imageUrl }
      : DEFAULT_NOTIFICATION_IMAGE;

  return (
    <Pressable
      onPress={handlePress}
      onLongPress={handleLongPress}
      hitSlop={{ top: 8, bottom: 8, left: 16, right: 16 }}
      className={cn(
        "flex-row items-start gap-3 px-4 py-3 bg-white border-b border-slate-100",
        mode === "candidate" && isSelected && "bg-sky-50/60",
      )}
      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
    >
      {/* Left: Avatar + overlays (unread dot / selection tick) */}
      <View style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}>
        <Image
          source={imageSource}
          style={{
            width: AVATAR_SIZE,
            height: AVATAR_SIZE,
            borderRadius: AVATAR_SIZE / 2,
          }}
          resizeMode="cover"
        />

        {/* Candidate mode selection overlay (Gmail-like) */}
        {mode === "candidate" && (
          <>
            {/* Dim avatar a bit in candidate mode for clarity */}
            <View
              className="absolute inset-0 rounded-full"
              style={{
                backgroundColor: isSelected
                  ? "rgba(2,132,199,0.10)"
                  : "rgba(15,23,42,0.04)",
              }}
            />
            <View
              className={cn("absolute inset-0 items-center justify-center")}
            >
              <View
                style={{
                  width: AVATAR_SIZE,
                  height: AVATAR_SIZE,
                  borderRadius: AVATAR_SIZE / 2,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {isSelected && (
                  <View
                    className="items-center justify-center rounded-full bg-sky-500"
                    style={{
                      width: AVATAR_SIZE,
                      height: AVATAR_SIZE,
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: Math.round(AVATAR_SIZE * 0.3),
                        fontWeight: "700",
                        lineHeight: Math.round(AVATAR_SIZE * 0.4),
                        textAlign: "center",
                      }}
                    >
                      ✓
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </>
        )}
      </View>

      {/* Center: Content */}
      <View className="flex-1 min-w-0">
        {/* Row 1: Title + Time */}
        <View className="flex-row items-start justify-between gap-3">
          <Text
            className={cn(
              "flex-1 text-[15px] leading-5",
              isUnread
                ? "font-semibold text-slate-900"
                : "font-normal text-slate-800",
            )}
            numberOfLines={1}
          >
            {notification.title ?? "Notification"}
          </Text>

          <Text
            className={cn(
              "text-[12px] leading-5",
              isUnread
                ? "font-semibold text-slate-900"
                : "font-normal text-slate-500",
            )}
          >
            {formatTime(notification.sentAt)}
          </Text>
        </View>

        {/* Row 2: Snippet/body  */}
        <Text
          className={cn(
            "mt-0.5 text-[13px] leading-5",
            isUnread
              ? "font-medium text-slate-800"
              : "font-normal text-slate-500",
          )}
          numberOfLines={2}
        >
          {notification.body ?? ""}
        </Text>
      </View>
    </Pressable>
  );
};
