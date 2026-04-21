// src/features/handover/components/HandoverRequestCard.tsx

import type { Handover, ReturnReportStatus } from "@/src/features/handover/types";
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
import {
  getHandoverCounterpart,
  getHandoverNextStep,
  getHandoverStatusLabel,
  getHandoverTitle,
  getViewerRoleContext,
} from "./handover.presentation";

const STATUS_THEME: Record<ReturnReportStatus, { bg: string; text: string }> = {
  Ongoing:   { bg: colors.kazan[100], text: colors.kazan[600] },
  Delivered: { bg: colors.info[100],  text: colors.info[500] },
  Confirmed: { bg: colors.babu[100],  text: colors.babu[500] },
  Rejected:  { bg: colors.error[100], text: colors.error[500] },
  Closed:    { bg: colors.hof[100],   text: colors.hof[400] },
};

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

  const imageUrl =
    handover.finderPost?.imageUrls?.[0] ?? handover.ownerPost?.imageUrls?.[0];

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(HANDOVER_ROUTE.detail(handover.id));
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.84}
      className="flex-row items-center gap-md rounded-2xl bg-surface px-md py-md2 mb-md2 border border-divider"
      style={
        Platform.OS === "ios"
          ? metrics.shadows.level1.ios
          : metrics.shadows.level1.android
      }
    >
      <View className="relative">
        <AppImage
          source={{ uri: imageUrl }}
          style={{ width: 72, height: 72, borderRadius: 14 }}
          resizeMode="cover"
        />

        {counterpart && (
          <View
            className="absolute bottom-[-4] right-[-4]"
            style={{
              borderWidth: 2,
              borderColor: colors.white,
              borderRadius: 10,
            }}
          >
            <AppUserAvatar avatarUrl={counterpart.avatarUrl} size={26} borderRadius={8} />
          </View>
        )}
      </View>

      <View className="flex-1">
        <Text
          className="text-sm font-semibold text-textPrimary"
          numberOfLines={1}
        >
          {title}
        </Text>

        <View className="flex-row items-center gap-xs flex-wrap">
          <View
            className="px-2 py-0.5 rounded-full"
            style={{ backgroundColor: STATUS_THEME[handover.status].bg }}
          >
            <Text
              className="text-xs font-semibold"
              style={{ color: STATUS_THEME[handover.status].text }}
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

        <Text
          className="text-sm font-medium text-textPrimary mt-sm"
          numberOfLines={1}
        >
          {nextStep}
        </Text>

        <View className="gap-xs">
          <Text className="text-xs text-textMuted" numberOfLines={1}>
            {roleContext}
          </Text>

          <View className="flex-row items-center gap-sm">
            <View className="flex-row items-center gap-xs">
              <CalendarBlankIcon size={11} color={colors.text.muted} />
              <Text className="text-xs text-textMuted">
                {formatDate(handover.createdAt)}
              </Text>
            </View>

            {(handover.status === "Ongoing" || handover.status === "Delivered") && (
              <View className="flex-row items-center gap-xs">
                <ClockCountdownIcon size={11} color={colors.text.muted} />
                <Text className="text-xs text-textMuted">
                  {formatDate(handover.expiresAt)}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <CaretRightIcon size={16} color={colors.text.muted} />
    </TouchableOpacity>
  );
};
