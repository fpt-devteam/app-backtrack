import {
  formatTime,
  ICON_SIZE,
} from "@/src/features/notification/components/NotificationRow/utils";
import type { UserNotification } from "@/src/features/notification/types";
import { colors } from "@/src/shared/theme";
import { MapPinIcon, QrCodeIcon } from "phosphor-react-native";
import React from "react";
import { Linking, Pressable, Text, TouchableOpacity, View } from "react-native";
import type { LatLng } from "react-native-maps";

type Props = {
  notification: UserNotification;
  onPress: (notification: UserNotification) => void;
};

export const QRScanNotificationRow = ({ notification, onPress }: Props) => {
  const isUnread = notification.status === "Unread";

  const body = (() => {
    if (!notification.data?.location) return notification.body;

    const location = notification.data.location as LatLng;
    const { latitude, longitude } = location;
    const displayAddress = notification.data.displayAddress as
      | string
      | undefined;

    return (
      <View className="flex-row items-center justify-between gap-sm">
        <View className="flex-1 flex-row items-center gap-xs min-w-0">
          <MapPinIcon size={12} color={colors.black} weight="fill" />
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
          className="bg-secondary px-sm py-xs rounded-lg items-center justify-center"
          style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
        >
          <Text className="text-white text-xs font-medium">View on Map</Text>
        </Pressable>
      </View>
    );
  })();

  return (
    <TouchableOpacity
      onPress={() => onPress(notification)}
      className="flex-row items-start gap-sm px-sm py-md2 border-b border-divider"
      style={{
        backgroundColor: isUnread ? colors.accent : colors.surface,
      }}
    >
      {/* Icon */}
      <View className="w-12 aspect-square items-center justify-center">
        <QrCodeIcon size={ICON_SIZE} color={colors.status.info} weight="bold" />
      </View>

      {/* Content */}
      <View className="flex-1 min-w-0">
        <View className="flex-row items-start justify-between gap-xs">
          <Text
            className="flex-1 text-base leading-5 font-normal text-textPrimary"
            numberOfLines={1}
          >
            {notification.title ?? "QR code scanned"}
          </Text>

          <Text className="text-sm font-normal text-textPrimary">
            {formatTime(notification.sentAt)}
          </Text>
        </View>

        <Text
          className="text-sm font-thin text-textSecondary"
          numberOfLines={2}
        >
          {body}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
