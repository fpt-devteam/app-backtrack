import { PostCategoryBadge } from "@/src/features/post/components/PostCategoryBadge";
import { PostTypeIconBadge } from "@/src/features/post/components/PostTypeIconBadge";
import { SimilarPost } from "@/src/features/post/types/post.type";
import { AppImage } from "@/src/shared/components";
import { colors, metrics } from "@/src/shared/theme";
import {
  formatIsoDate,
  parseStringToDate,
} from "@/src/shared/utils/datetime.utils";
import { MotiPressable } from "moti/interactions";
import { ClockIcon, MapPinIcon } from "phosphor-react-native";
import React, { useMemo } from "react";
import { Text, View } from "react-native";
import ScoreBadge from "./ScoreBadge";

type SimilarPostCardProps = {
  item: SimilarPost;
  onPress: () => void;
};

export const SimilarPostCard = ({ item, onPress }: SimilarPostCardProps) => {
  const imageUrl = item.imageUrls[0];

  const categoryLabel = useMemo(() => {
    return item.category;
  }, [item.category]);

  const itemNameLabel = useMemo(
    () => item.postTitle || "Untitled item",
    [item],
  );

  const locationLabel = useMemo(() => {
    if (item.displayAddress?.trim()) return item.displayAddress;
    if (item.location?.latitude != null && item.location?.longitude != null) {
      return `${item.location.latitude.toFixed(4)}, ${item.location.longitude.toFixed(4)}`;
    }
    return "Unknown location";
  }, [item.displayAddress, item.location]);

  const eventTimeLabel = useMemo(() => {
    if (!item.eventTime) return "Unknown time";
    const date = parseStringToDate(item.eventTime);
    if (!date) return "Unknown time";
    return formatIsoDate(date);
  }, [item.eventTime]);

  const safeScore = useMemo(() => {
    if (item.score == null) return 0;
    return Math.round(item.score * 100);
  }, [item]);

  return (
    <MotiPressable
      onPress={onPress}
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
        backgroundColor: colors.surface,
        borderRadius: metrics.borderRadius.lg,
        padding: metrics.spacing.md2,

        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      }}
    >
      <View className="flex-row gap-sm">
        {/* IMAGE */}
        <View
          className="relative w-28 overflow-hidden rounded-sm"
          style={{ aspectRatio: 1.18 }}
        >
          <AppImage
            style={{ width: "100%", height: "100%" }}
            source={{ uri: imageUrl }}
          />

          <View className="absolute top-1 right-1">
            <ScoreBadge value={safeScore} />
          </View>
        </View>

        {/* INFO STRIP */}
        <View className="flex-1 gap-xs">
          {/* Post Title */}
          <Text
            numberOfLines={1}
            className="text-lg font-normal text-textPrimary"
          >
            {itemNameLabel}
          </Text>

          {/* Badges row */}
          <View className="flex-row gap-xs items-center justify-start">
            {/* Post Type  */}
            <PostTypeIconBadge status={item.postType} size="xs" />

            {/* Post Category */}
            <PostCategoryBadge category={categoryLabel} />
          </View>

          <View>
            {/* Location */}
            <View className="flex-row items-center gap-xs">
              <MapPinIcon size={12} color={colors.secondary} weight="thin" />
              <Text
                numberOfLines={1}
                className="flex-1 text-xs leading-5 font-thin text-textMuted"
              >
                {locationLabel}
              </Text>
            </View>

            {/* Event Time */}
            <View className="flex-row items-center gap-xs">
              <ClockIcon size={12} color={colors.secondary} weight="thin" />
              <Text
                numberOfLines={1}
                className="flex-1 text-xs leading-5 font-thin text-textMuted"
              >
                {eventTimeLabel}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </MotiPressable>
  );
};
