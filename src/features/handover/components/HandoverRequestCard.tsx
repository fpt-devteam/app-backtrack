// src/features/handover/components/HandoverRequestCard.tsx

import type { Handover } from "@/src/features/handover/types";
import {
  getHandoverCounterpart,
  getHandoverNextStep,
  getHandoverStatusLabel,
  getHandoverTitle,
  getViewerRoleContext,
} from "./handover.presentation";
import { AppImage, AppUserAvatar } from "@/src/shared/components";
import { HANDOVER_ROUTE } from "@/src/shared/constants";
import { colors, metrics } from "@/src/shared/theme";
import { formatDate } from "@/src/shared/utils";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import {
  CalendarBlankIcon,
  CaretRightIcon,
  ClockCountdownIcon,
} from "phosphor-react-native";
import React from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";

type Props = {
  handover: Handover;
  currentUserId: string;
};

export const HandoverRequestCard = ({ handover, currentUserId }: Props) => {
  const counterpart = getHandoverCounterpart(handover, currentUserId);
  const title = getHandoverTitle(handover);
  const statusLabel = getHandoverStatusLabel(handover.status);
  const nextStep = getHandoverNextStep(handover, currentUserId);
  const roleContext = getViewerRoleContext(handover, currentUserId);

  const imageUrl = handover.finderPost?.imageUrls?.[0] ?? handover.ownerPost?.imageUrls?.[0];

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(HANDOVER_ROUTE.detail(handover.id));
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.84}
      className="flex-row items-center gap-md rounded-2xl bg-surface px-md py-md2 mb-sm border border-divider"
      style={Platform.OS === "ios" ? metrics.shadows.level1.ios : metrics.shadows.level1.android}
    >
      <View className="relative">
        <AppImage
          source={{ uri: imageUrl }}
          style={{ width: 72, height: 72, borderRadius: 14 }}
          resizeMode="cover"
        />

        {counterpart && (
          <View
            className="absolute bottom-[-6] right-[-6] rounded-full"
            style={{
              borderWidth: 2,
              borderColor: colors.white,
            }}
          >
            <AppUserAvatar avatarUrl={counterpart.avatarUrl} size={30} />
          </View>
        )}
      </View>

      <View className="flex-1 gap-xs">
        <Text className="text-sm font-semibold text-textPrimary" numberOfLines={1}>
          {title}
        </Text>

        <View className="flex-row items-center gap-xs flex-wrap">
          <View
            className="px-2 py-0.5 rounded-full"
            style={{ backgroundColor: handover.status === "Active" ? colors.kazan[100] : colors.hof[100] }}
          >
            <Text
              className="text-xs font-semibold"
              style={{ color: handover.status === "Active" ? colors.kazan[600] : colors.hof[600] }}
            >
              {statusLabel}
            </Text>
          </View>

          {counterpart?.displayName ? (
            <Text className="text-xs text-textSecondary" numberOfLines={1}>
              with {counterpart.displayName}
            </Text>
          ) : null}
        </View>

        <Text className="text-sm font-medium text-textPrimary" numberOfLines={1}>
          {nextStep}
        </Text>

        <View className="gap-xs">
          <Text className="text-xs text-textMuted" numberOfLines={1}>
            {roleContext}
          </Text>

          <View className="flex-row items-center gap-sm">
            <View className="flex-row items-center gap-xs">
              <CalendarBlankIcon size={11} color={colors.text.muted} />
              <Text className="text-xs text-textMuted">{formatDate(handover.createdAt)}</Text>
            </View>

            {(handover.status === "Draft" || handover.status === "Active") && (
              <View className="flex-row items-center gap-xs">
                <ClockCountdownIcon size={11} color={colors.text.muted} />
                <Text className="text-xs text-textMuted">{formatDate(handover.expiresAt)}</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <CaretRightIcon size={16} color={colors.text.muted} />
    </TouchableOpacity>
  );
};
