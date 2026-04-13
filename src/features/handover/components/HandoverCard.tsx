// src/features/handover/components/HandoverCard.tsx

import type { Handover } from "@/src/features/handover/types";
import { PostStatusBadge } from "@/src/features/post/components";
import { AppImage } from "@/src/shared/components";
import { HANDOVER_ROUTE } from "@/src/shared/constants";
import { colors } from "@/src/shared/theme";
import { formatDate } from "@/src/shared/utils";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { ArrowsLeftRightIcon, CalendarBlankIcon } from "phosphor-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type HandoverCardProps = {
  report: Handover;
  width: number;
};

function deriveDisplayName(report: Handover): string {
  const finderName = report.finderPost?.item.itemName;
  const ownerName = report.ownerPost?.item.itemName;
  if (finderName && ownerName) return `${finderName} ↔ ${ownerName}`;
  if (finderName) return `Found: ${finderName}`;
  if (ownerName) return `Lost: ${ownerName}`;
  return "Return Report";
}

export const HandoverCard = ({ report, width }: HandoverCardProps) => {
  const imageHeight = Math.floor(width * 0.52);
  const halfWidth = Math.floor(width / 2);
  const firstImageUrl = report.finderPost?.imageUrls?.[0];
  const secondImageUrl = report.ownerPost?.imageUrls?.[0];

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(HANDOVER_ROUTE.detail(report.id));
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.85}
      style={{ width }}
      className="overflow-hidden rounded-xs"
    >
      {/* Image area */}
      <View
        className="rounded-2xl overflow-hidden flex-row"
        style={{ width, height: imageHeight }}
      >
        {/* Left half — finder post */}
        <View style={{ width: halfWidth, height: imageHeight }}>
          <AppImage
            source={{ uri: firstImageUrl }}
            style={{ width: halfWidth, height: imageHeight }}
            resizeMode="cover"
          />
          {report.finderPost && (
            <View className="absolute bottom-2 left-2">
              <PostStatusBadge status={report.finderPost.postType} size="sm" />
            </View>
          )}
        </View>

        {/* Right half — owner post */}
        <View style={{ width: halfWidth, height: imageHeight }}>
          <AppImage
            source={{ uri: secondImageUrl }}
            style={{ width: halfWidth, height: imageHeight }}
            resizeMode="cover"
          />
          {report.ownerPost && (
            <View className="absolute bottom-2 right-2">
              <PostStatusBadge status={report.ownerPost.postType} size="sm" />
            </View>
          )}
        </View>

        {/* Center arrow overlay */}
        <View
          className="absolute inset-0 items-center justify-center"
          pointerEvents="none"
        >
          <View style={styles.arrowBadge}>
            <ArrowsLeftRightIcon
              size={18}
              color={colors.text.primary}
              weight="bold"
            />
          </View>
        </View>
      </View>

      {/* Footer */}
      <View className="pt-sm gap-xs">
        <Text
          className="text-sm font-semibold text-textPrimary"
          numberOfLines={1}
        >
          {deriveDisplayName(report)}
        </Text>
        <View className="flex-row items-center gap-sm">
          <View className="flex-row items-center gap-xs">
            <CalendarBlankIcon size={12} color={colors.text.muted} />
            <Text className="text-xs text-textMuted">
              {formatDate(report.createdAt)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  arrowBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 5,
  },
});
