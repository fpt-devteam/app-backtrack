import type { SimilarPost } from "@/src/features/post/types";
import { AppImage } from "@/src/shared/components";
import { POST_ROUTE } from "@/src/shared/constants";
import { colors, metrics } from "@/src/shared/theme";
import { router } from "expo-router";
import { CalendarBlankIcon, MapPinIcon } from "phosphor-react-native";
import React from "react";
import { Platform, Pressable, Text, View } from "react-native";
import PostMatchingScoreBadge from "./PostMatchingScoreBadge";

type SimilarPostCardProps = {
  postId: string;
  matchPost?: SimilarPost;
};

const formatTimeGap = (days: number): string => {
  if (days === 0) return "Same day";
  if (days === 1) return "1 day apart";
  if (days < 7) return `${days} days apart`;
  if (days < 14) return "~1 week apart";
  if (days < 30) return `~${Math.round(days / 7)} weeks apart`;
  if (days < 60) return "~1 month apart";
  return `~${Math.round(days / 30)} months apart`;
};

export const SimilarPostCardSkeleton = () => {
  return (
    <View
      className="bg-surface border border-divider overflow-hidden"
      style={{ borderRadius: metrics.borderRadius.primary }}
    >
      <View className="w-full bg-muted animate-pulse" style={{ height: 160 }} />
      <View style={{ padding: 10, gap: 6 }}>
        <View className="h-3.5 w-3/4 rounded-md bg-muted animate-pulse" />
        <View className="h-3 w-1/2 rounded-md bg-muted animate-pulse" />
        <View className="h-3 w-2/5 rounded-md bg-muted animate-pulse" />
      </View>
    </View>
  );
};

export const SimilarPostCard = ({
  postId,
  matchPost,
}: SimilarPostCardProps) => {
  if (!matchPost) return <SimilarPostCardSkeleton />;

  const imgUrl = matchPost.imageUrls?.[0];

  const handleNavigateToMatch = () => {
    router.push(POST_ROUTE.detailMatch(postId, matchPost.id));
  };

  return (
    <Pressable
      onPress={handleNavigateToMatch}
      className="bg-surface border border-divider overflow-hidden active:opacity-70"
      style={[
        { borderRadius: metrics.borderRadius.primary },
        Platform.OS === "ios"
          ? metrics.shadows.level1.ios
          : metrics.shadows.level1.android,
      ]}
    >
      {/* Image with badge overlay */}
      <View style={{ position: "relative" }}>
        <AppImage
          source={{ uri: imgUrl }}
          style={{ width: "100%", height: 160 }}
          resizeMode="cover"
        />
        <View style={{ position: "absolute", top: 6, right: 6 }}>
          <PostMatchingScoreBadge level={matchPost.matchingLevel} />
        </View>
      </View>

      {/* Text content */}
      <View style={{ padding: 10, gap: 6 }}>
        <Text
          className="text-base font-bold"
          style={{ color: colors.hof[900] }}
          numberOfLines={1}
        >
          {matchPost.item.itemName}
        </Text>

        <View className="flex-row items-center" style={{ gap: 4 }}>
          <MapPinIcon size={14} color={colors.primary} weight="regular" />
          <Text
            className="flex-1 text-sm"
            style={{ color: colors.hof[500] }}
            numberOfLines={1}
          >
            {matchPost.displayAddress}
          </Text>
        </View>

        <View className="flex-row items-center" style={{ gap: 4 }}>
          <CalendarBlankIcon
            size={14}
            color={colors.primary}
            weight="regular"
          />
          <Text
            className="flex-1 text-sm"
            style={{ color: colors.hof[400] }}
            numberOfLines={1}
          >
            {formatTimeGap(matchPost.timeGapDays)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};
