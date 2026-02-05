import type { UserNotification } from "@/src/features/notification/types";
import { colors } from "@/src/shared/theme";
import { cn } from "@/src/shared/utils/cn";
import {
  ChatsIcon,
  CheckCircleIcon,
  CircleIcon,
  MapPinIcon,
  QrCodeIcon,
  SparkleIcon,
  WarningCircleIcon,
} from "phosphor-react-native";
import React, { useMemo } from "react";
import { Linking, Pressable, Text, View } from "react-native";
import { LatLng } from "react-native-maps";

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

const AVATAR_SIZE = 40;

const icon = {
  ChatEvent: <ChatsIcon size={AVATAR_SIZE} color={colors.primary} />,
  AIMatchingEvent: <SparkleIcon size={AVATAR_SIZE} color={colors.amber[500]} />,
  QRScanEvent: <QrCodeIcon size={AVATAR_SIZE} color={colors.status.info} />,
  SystemAlertEvent: (
    <WarningCircleIcon size={AVATAR_SIZE} color={colors.status.error} />
  ),
} as const;

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

  const bodyDisplay = useMemo(() => {
    const type = notification.type;
    if (type === "QRScanEvent") {
      if (!notification?.data?.location)
        return "The scanner did not share their location!";

      const location = notification.data?.location as LatLng;
      const { latitude, longitude } = location;

      const displayAddress = notification.data?.displayAddress as string;

      return (
        <View className="flex-row items-center justify-between gap-4">
          <View className="flex-1 flex-row items-center gap-1 min-w-0">
            <MapPinIcon size={16} color={colors.slate[600]} weight="fill" />
            <Text className="text-sm flex-1" numberOfLines={1}>
              {displayAddress ??
                `lat: ${latitude.toFixed(2)}, lng: ${longitude.toFixed(2)}`}
            </Text>
          </View>

          <Pressable
            onPress={() => {
              const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
              Linking.openURL(url);
            }}
            className="bg-blue-50 px-3 py-1.5 rounded-full"
          >
            <Text className="text-primary text-xs font-medium">View Map</Text>
          </Pressable>
        </View>
      );
    }

    return notification.body;
  }, [notification]);

  return (
    <Pressable
      onPress={handlePress}
      onLongPress={handleLongPress}
      className="flex-row items-start gap-3 p-4 bg-white border-b border-slate-100"
      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
    >
      {mode === "candidate" && (
        <View className="items-center justify-center rounded-full">
          {isSelected ? (
            <CheckCircleIcon
              size={32}
              color={colors.primary}
              weight="duotone"
            />
          ) : (
            <CircleIcon size={32} color={colors.primary} />
          )}
        </View>
      )}

      {/* Left: Avatar + overlays  */}
      <View className="items-center justify-center rounded-full">
        {icon[notification.type]}
      </View>

      {/* Center: Content */}
      <View className="flex-1 min-w-0">
        {/* Row 1: Title + Time */}
        <View className="flex-row items-start justify-between gap-3">
          <Text
            className={cn(
              "flex-1 text-base leading-5",
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
              "text-sm leading-5",
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
          numberOfLines={1}
        >
          {bodyDisplay}
        </Text>
      </View>
    </Pressable>
  );
};
