import { type Post } from "@/src/features/post/types";
import { AppImage } from "@/src/shared/components/AppImage";
import { POST_ROUTE } from "@/src/shared/constants";
import { colors, metrics } from "@/src/shared/theme";
import {
  calculateTimeDifference,
  formatTimeDifference,
} from "@/src/shared/utils/datetime.utils";
import { router } from "expo-router";
import { MotiPressable } from "moti/interactions";
import { MapPinIcon } from "phosphor-react-native";
import React, { useCallback, useMemo } from "react";
import { Text, useWindowDimensions, View } from "react-native";
import { PostStatusBadge } from "./PostStatusBadge";

type PostCardProps = {
  item: Post;
  size?: "sm" | "md";
};

export const PostCard = ({ item, size = "sm" }: PostCardProps) => {
  const { width } = useWindowDimensions();

  const cardWidth = width * (size === "sm" ? 0.43 : 0.9);
  const imageUrl = item.imageUrls[0];

  const eventTimeLabel = useMemo(() => {
    const tickDiff = calculateTimeDifference(item.eventTime, new Date());
    const formattedTime = formatTimeDifference(tickDiff);
    return formattedTime;
  }, [item.eventTime]);

  const itemNameLabel = useMemo(
    () => item.item?.itemName || "Untitled item",
    [item.item?.itemName],
  );

  const locationLabel = useMemo(() => {
    if (item.displayAddress?.trim()) return item.displayAddress;
    if (item.location?.latitude != null && item.location?.longitude != null) {
      return `${item.location.latitude.toFixed(4)}, ${item.location.longitude.toFixed(4)}`;
    }
    return "Unknown location";
  }, [item.displayAddress, item.location?.latitude, item.location?.longitude]);

  const handleOpenDetail = useCallback(() => {
    router.push(POST_ROUTE.details(item.id));
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
        width: cardWidth,
        backgroundColor: colors.surface,
        borderRadius: metrics.borderRadius.lg,
        overflow: "hidden",
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        gap: 8,
        shadowOpacity: 0.1,
        shadowRadius: 4,
      }}
    >
      {/* IMAGE */}
      <View className="w-full overflow-hidden" style={{ aspectRatio: 1.18 }}>
        <AppImage
          resizeMode="cover"
          className="w-full h-full"
          source={{ uri: imageUrl }}
        />

        {/* Status badge */}
        <View className="absolute top-2 left-2">
          <View className="p-2 rounded-full bg-white bg-opacity-60 items-center justify-center shadow-xs">
            <Text className="text-xs font-medium text-textPrimary">
              {eventTimeLabel}
            </Text>
          </View>
        </View>

        {/* Post Type badge */}
        <View className="absolute top-2 right-2">
          <PostStatusBadge status={item.postType} />
        </View>
      </View>

      {/* INFO STRIP */}
      <View className="bg-surface px-3 pt-1 pb-0.5 gap-0.5 ">
        <Text
          numberOfLines={2}
          className="text-sm font-normal text-textPrimary"
        >
          {itemNameLabel}
        </Text>

        <View className="flex-row items-center gap-1.5 pr-2">
          <MapPinIcon size={10} color={colors.primary} weight="fill" />
          <Text
            numberOfLines={1}
            className="text-xs leading-5 font-normal text-textMuted"
          >
            {locationLabel}
          </Text>
        </View>
      </View>
    </MotiPressable>
  );
};
