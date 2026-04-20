// src/features/handover/components/HandoverRequestCard.tsx

import type { Handover } from "@/src/features/handover/types";
import { AppImage, AppUserAvatar } from "@/src/shared/components";
import { HANDOVER_ROUTE } from "@/src/shared/constants";
import { colors } from "@/src/shared/theme";
import { formatDate } from "@/src/shared/utils";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { CalendarBlankIcon, CaretRightIcon } from "phosphor-react-native";
import React, { useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  handover: Handover;
  currentUserId: string;
};

function deriveDisplayName(handover: Handover): string {
  const finderName = handover.finderPost?.item.itemName;
  const ownerName = handover.ownerPost?.item.itemName;
  if (finderName && ownerName) return `${finderName} ↔ ${ownerName}`;
  if (finderName) return `Found: ${finderName}`;
  if (ownerName) return `Lost: ${ownerName}`;
  return "Return Report";
}

export const HandoverRequestCard = ({ handover, currentUserId }: Props) => {
  const isFinder = handover.finder?.id === currentUserId;
  const counterpart = isFinder ? handover.owner : handover.finder;
  const roleLabel = isFinder ? "You found it" : "You lost it";

  const imageUrl = useMemo(
    () =>
      handover.finderPost?.imageUrls?.[0] ??
      handover.ownerPost?.imageUrls?.[0],
    [handover],
  );

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(HANDOVER_ROUTE.detail(handover.id));
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      className="flex-row items-center gap-md py-md border-b border-divider"
    >
      {/* Item image */}
      <View className="relative">
        <AppImage
          source={{ uri: imageUrl }}
          style={{ width: 64, height: 64, borderRadius: 10 }}
          resizeMode="cover"
        />
        {counterpart && (
          <View
            className="absolute bottom-[-10] right-[-8]"
            style={{
              borderWidth: 2,
              borderColor: colors.white,
              borderRadius: 999,
            }}
          >
            <AppUserAvatar avatarUrl={counterpart.avatarUrl} size={28} />
          </View>
        )}
      </View>

      {/* Details */}
      <View className="flex-1 flex-col gap-xs">
        <Text
          className="text-sm font-semibold text-textPrimary"
          numberOfLines={1}
        >
          {deriveDisplayName(handover)}
        </Text>

        <View className="flex-row items-center gap-xs">
          <View
            className="px-2 py-0.5 rounded-full"
            style={{ backgroundColor: colors.hof[100] }}
          >
            <Text
              className="text-xs font-medium"
              style={{ color: colors.hof[600] }}
            >
              {roleLabel}
            </Text>
          </View>
          {counterpart?.displayName && (
            <Text
              className="text-xs text-textMuted"
              numberOfLines={1}
              style={{ flexShrink: 1 }}
            >
              with {counterpart.displayName}
            </Text>
          )}
        </View>

        <View className="flex-row items-center gap-xs">
          <CalendarBlankIcon size={11} color={colors.text.muted} />
          <Text className="text-xs text-textMuted">
            {formatDate(handover.createdAt)}
          </Text>
        </View>
      </View>

      {/* Chevron */}
      <CaretRightIcon size={16} color={colors.text.muted} />
    </TouchableOpacity>
  );
};
