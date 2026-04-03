import type { SimilarPost } from "@/src/features/post/types";
import { AppImage } from "@/src/shared/components";
import { POST_ROUTE } from "@/src/shared/constants";
import { colors } from "@/src/shared/theme";
import { formatIsoDate } from "@/src/shared/utils";
import { router } from "expo-router";
import { ClockIcon, MapPinIcon } from "phosphor-react-native";
import React from "react";
import { Pressable, Text, View } from "react-native";
import PostMatchingScoreBadge from "./PostMatchingScoreBadge";

type SimilarPostCardProps = {
  postId: string;
  matchPost?: SimilarPost;
};

export const SimilarPostCardSkeleton = () => {
  return (
    <View className="flex-row gap-3 bg-surface rounded-2xl border border-divider p-3 shadow-sm">
      <View className="w-20 h-20 rounded-xl bg-slate-200 animate-pulse border border-divider shadow-sm" />

      <View className="flex-1 justify-between py-0.5">
        <View className="flex-row items-start justify-between gap-2">
          <View className="h-4 flex-1 rounded-md bg-slate-200 animate-pulse mt-0.5" />
          <View className="h-6 w-20 rounded-full bg-slate-200 animate-pulse shrink-0" />
        </View>

        <View className="mt-1.5 flex-row items-center gap-1.5 pr-2">
          <View className="w-3.5 h-3.5 bg-slate-200 rounded-full animate-pulse shrink-0" />
          <View className="h-3 w-3/4 rounded-md bg-slate-200 animate-pulse" />
        </View>

        <View className="mt-1.5 flex-row items-center gap-1.5 pr-2">
          <View className="w-3.5 h-3.5 bg-slate-200 rounded-full animate-pulse shrink-0" />
          <View className="h-3 w-3/4 rounded-md bg-slate-200 animate-pulse" />
        </View>
      </View>
    </View>
  );
};

export const SimilarPostCard = ({
  postId,
  matchPost,
}: SimilarPostCardProps) => {
  if (!matchPost) return <SimilarPostCardSkeleton />;

  const imgUrl = matchPost.images?.[0]?.url;

  const handleNavigateToMatch = () => {
    router.push(POST_ROUTE.detailMatch(postId, matchPost.id));
  };

  return (
    <Pressable
      onPress={handleNavigateToMatch}
      className="flex-row gap-3 bg-surface rounded-2xl border border-divider p-3 shadow-sm active:opacity-70"
    >
      <AppImage
        source={{ uri: imgUrl }}
        className="w-20 h-20 rounded-xl border border-divider shadow-sm active:opacity-70"
        resizeMode="cover"
      />

      <View className="flex-1 justify-between py-0.5">
        <View className="flex-row items-start justify-between gap-2">
          <Text
            className="flex-1 text-sm font-bold"
            style={{ color: colors.slate[900] }}
            numberOfLines={1}
          >
            {matchPost.itemName}
          </Text>

          <View className="shrink-0">
            <PostMatchingScoreBadge score={matchPost.matchScore} />
          </View>
        </View>

        <View className="mt-1.5 flex-row items-center gap-1.5 pr-2">
          <MapPinIcon size={14} color={colors.primary} weight="regular" />
          <Text
            className="flex-1 text-xs font-medium"
            style={{ color: colors.slate[500] }}
            numberOfLines={1}
          >
            {matchPost.displayAddress}
          </Text>
        </View>

        <View className="mt-1.5 flex-row items-center gap-1.5 pr-2">
          <ClockIcon size={14} color={colors.primary} weight="regular" />
          <Text
            className="flex-1 text-xs font-medium"
            style={{ color: colors.slate[500] }}
            numberOfLines={1}
          >
            {formatIsoDate(matchPost.eventTime)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};
