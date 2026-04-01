import type { Post } from "@/src/features/post/types";
import { POST_ROUTE } from "@/src/shared/constants";
import { colors } from "@/src/shared/theme";
import { formatShortEventTime } from "@/src/shared/utils/datetime.utils";
import { router } from "expo-router";
import { MotiPressable } from "moti/interactions";
import { ClockIcon, ImageIcon, MapPinIcon } from "phosphor-react-native";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  View,
} from "react-native";
import { PostStatusBadge } from "./PostStatusBadge";

type PostCardProps = {
  item: Post;
};

export const PostCard = ({ item }: PostCardProps) => {
  const imageUrl = item.images?.[0]?.url;
  const [imageLoading, setImageLoading] = useState(true);

  // "Jan 15 · 14:30" — date + time, more scannable than date-only
  const eventTimeLabel = useMemo(
    () => formatShortEventTime(item.eventTime),
    [item.eventTime]
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
        width: "47%",
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: colors.card,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      {/* IMAGE */}
      <View className="w-full bg-slate-100" style={{ aspectRatio: 4 / 3 }}>
        {imageUrl ? (
          <>
            <Image
              resizeMode="cover"
              className="w-full h-full"
              source={{ uri: imageUrl }}
              onLoadStart={() => setImageLoading(true)}
              onLoadEnd={() => setImageLoading(false)}
            />
            {imageLoading && (
              <View className="absolute inset-0 items-center justify-center bg-slate-100">
                <ActivityIndicator size="small" color={colors.slate[400]} />
              </View>
            )}
          </>
        ) : (
          <View className="flex-1 items-center justify-center" style={{ gap: 4 }}>
            <ImageIcon size={28} color={colors.slate[300]} weight="thin" />
            <Text className="text-[10px] text-slate-400">No image</Text>
          </View>
        )}

        {/* Status badge */}
        <View className="absolute top-2 left-2">
          <PostStatusBadge status={item.postType} size="sm" />
        </View>
      </View>

      {/* INFO STRIP */}
      <View className="px-2 pt-2 pb-2.5 bg-white gap-1.5">
        {/* Title — loudest element */}
        <Text
          numberOfLines={2}
          className="text-sm font-medium text-slate-900 leading-[18px]"
        >
          {item.itemName}
        </Text>

        {/* Event time — secondary */}
        <View className="flex-row items-center gap-1">
          <ClockIcon size={11} color={colors.slate[400]} weight="bold" />
          <Text numberOfLines={1} className="text-[11px] text-slate-500 flex-1">
            {eventTimeLabel}
          </Text>
        </View>

        {/* Location — most muted */}
        <View className="flex-row items-center gap-1">
          <MapPinIcon size={10} color={colors.slate[300]} weight="fill" />
          <Text numberOfLines={1} className="text-[10px] text-slate-400 flex-1">
            {locationLabel}
          </Text>
        </View>
      </View>
    </MotiPressable>
  );
};
