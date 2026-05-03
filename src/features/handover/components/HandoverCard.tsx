import { useAppUser } from "@/src/features/auth/providers/user.provider";
import {
  getHandoverCounterpart,
  getHandoverNextStep,
  getHandoverStatusLabel,
  getHandoverTitle,
  getViewerRoleContext,
} from "@/src/features/handover/components/handover.presentation";
import type { Handover, HandoverStatus } from "@/src/features/handover/types";
import { AppImage, AppUserAvatar } from "@/src/shared/components";
import { HANDOVER_ROUTE, SHARED_ROUTE } from "@/src/shared/constants";
import React, { useCallback } from "react";
import { InteractionManager, Text, View } from "react-native";

import { colors, metrics } from "@/src/shared/theme";
import { router } from "expo-router";
import { MotiPressable } from "moti/interactions";
import { HandoverStatusBadge } from "./HandoverStatusBadge";

const STATUS_THEME: Record<HandoverStatus, { bg: string; text: string }> = {
  Ongoing: { bg: colors.kazan[100], text: colors.kazan[600] },
  Delivered: { bg: colors.info[100], text: colors.info[500] },
  Confirmed: { bg: colors.babu[100], text: colors.babu[500] },
  Rejected: { bg: colors.error[100], text: colors.error[500] },
  Closed: { bg: colors.hof[100], text: colors.hof[400] },
};

export const HandoverCard = ({ handover }: { handover: Handover }) => {
  const { user } = useAppUser();
  const currentUserId = user?.id;

  const counterpart = getHandoverCounterpart(handover, currentUserId);
  const title = getHandoverTitle(handover);
  const statusLabel = getHandoverStatusLabel(handover.status);
  const nextStep = getHandoverNextStep(handover, currentUserId);
  const roleContext = getViewerRoleContext(handover, currentUserId);

  const imageUrl =
    handover.finderPost?.imageUrls?.[0] ?? handover.ownerPost?.imageUrls?.[0];

  const handlePress = useCallback(() => {
    if (router.canDismiss()) router.dismiss();
    InteractionManager.runAfterInteractions(() => {
      router.navigate(SHARED_ROUTE.handoverDetail(handover.id));
    });
  }, [handover.id]);

  return (
    <MotiPressable
      onPress={handlePress}
      animate={({ pressed }) => {
        "worklet";
        return {
          scale: pressed ? 0.96 : 1,
          opacity: pressed ? 0.92 : 1,
        };
      }}
      transition={{ type: "spring", damping: 18, stiffness: 250 }}
      style={{
        width: "100%",
        flexDirection: "row",
        alignItems: "center",

        gap: metrics.spacing.md,
        borderRadius: metrics.borderRadius.lg,
        backgroundColor: colors.surface,

        padding: metrics.spacing.md,

        borderWidth: 1,
        borderColor: colors.divider,

        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      }}
    >
      {/* Image Section */}
      <View className="relative bg-surface">
        <View className="overflow-hidden">
          <AppImage
            source={{ uri: imageUrl }}
            style={{
              width: 64,
              height: 64,
              borderRadius: metrics.borderRadius.md,
            }}
            resizeMode="cover"
            isBlurred={false}
          />
        </View>

        {counterpart && (
          <View className="absolute bottom-[-4] right-[-4] border border-white rounded-full">
            <AppUserAvatar size={26} avatarUrl={counterpart.avatarUrl} />
          </View>
        )}
      </View>

      <View className="flex-1">
        {/* Title */}
        <View>
          <Text
            className="text-sm font-normal text-textPrimary"
            numberOfLines={1}
          >
            {title}
          </Text>
        </View>

        {/* Status Badge */}
        <View className="flex-row items-center gap-xs">
          <HandoverStatusBadge status={handover.status} />

          {counterpart?.displayName ? (
            <Text
              className="text-xs font-thin text-textSecondary"
              numberOfLines={1}
            >
              with {counterpart.displayName}
            </Text>
          ) : null}
        </View>

        {/* Next Step */}
        <View className="mt-sm">
          <Text
            className="text-sm font-normal text-textPrimary"
            numberOfLines={1}
          >
            {nextStep}
          </Text>

          <Text className="text-xs font-thin text-textMuted" numberOfLines={1}>
            {roleContext}
          </Text>
        </View>
      </View>
    </MotiPressable>
  );
};
