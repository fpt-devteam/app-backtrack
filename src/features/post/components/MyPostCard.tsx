import { PostCategoryBadge } from "@/src/features/post/components/PostCategoryBadge";
import { PostStatusBadge } from "@/src/features/post/components/PostStatusBadge";
import { PostTypeIconBadge } from "@/src/features/post/components/PostTypeIconBadge";
import { type UserPost } from "@/src/features/post/types/post.type";
import { AppImage } from "@/src/shared/components";
import { PROFILE_ROUTE } from "@/src/shared/constants/route.constant";
import { colors, metrics } from "@/src/shared/theme";
import { formatIsoDate } from "@/src/shared/utils/datetime.utils";
import { router } from "expo-router";
import { MotiPressable } from "moti/interactions";
import { ClockIcon, MapPinIcon } from "phosphor-react-native";
import React, { useCallback, useMemo } from "react";
import { Text, View } from "react-native";

type MyPostCardProps = {
  item: UserPost;
};

export const MyPostCard = ({ item }: MyPostCardProps) => {
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
    return formatIsoDate(item.eventTime);
  }, [item.eventTime]);

  const handleOpenDetail = useCallback(() => {
    router.push(PROFILE_ROUTE.userPostDetail(item.id));
  }, [item.id]);

  return (
    <MotiPressable
      onPress={handleOpenDetail}
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
          className="w-28 overflow-hidden rounded-sm"
          style={{ aspectRatio: 1.18 }}
        >
          <View className="">
            <AppImage className="w-full h-full" source={{ uri: imageUrl }} />
          </View>
        </View>

        {/* INFO STRIP */}
        <View className="flex-1">
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

            {/* PostStatus */}
            <PostStatusBadge status={item.status} />
          </View>

          {/* Location */}
          <View className="flex-row items-center gap-xs ">
            <MapPinIcon size={10} color={colors.primary} weight="fill" />
            <Text
              numberOfLines={1}
              className="flex-1 text-xs leading-5 font-normal text-textMuted"
            >
              {locationLabel}
            </Text>
          </View>

          {/* Event Time */}
          <View className="flex-row items-center gap-xs ">
            <ClockIcon size={10} color={colors.primary} weight="fill" />
            <Text
              numberOfLines={1}
              className="flex-1 text-xs leading-5 font-normal text-textMuted"
            >
              {eventTimeLabel}
            </Text>
          </View>
        </View>
      </View>
    </MotiPressable>
  );
};
