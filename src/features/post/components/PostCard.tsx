import type { Post } from "@/src/features/post/types";
import { POST_ROUTE } from "@/src/shared/constants";
import { colors } from "@/src/shared/theme";
import { formatDate } from "@/src/shared/utils";
import { router } from "expo-router";
import { ClockIcon, MapPinIcon } from "phosphor-react-native";
import React, { useCallback, useMemo } from "react";
import {
  Image,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { PostStatusBadge } from "./PostStatusBadge";

type CardType = "vertical" | "horizontal";

type PostCardProps = {
  item: Post;
  type?: CardType;
};

export const PostCard = ({ item, type = "vertical" }: PostCardProps) => {
  const imageUrl = item.images?.[0]?.url;
  const dimensions = useWindowDimensions();

  const eventTimeLabel = useMemo(() => {
    return formatDate(item.eventTime.toString());
  }, [item.eventTime]);

  const locationLabel = useMemo(() => {
    if (item.displayAddress?.trim()) {
      return item.displayAddress;
    }

    if (item.location?.latitude != null && item.location?.longitude != null) {
      return `${item.location.latitude.toFixed(5)}, ${item.location.longitude.toFixed(5)}`;
    }

    return "Unknown location";
  }, [item.displayAddress, item.location?.latitude, item.location?.longitude]);

  const handleOpenDetail = useCallback(() => {
    router.push(POST_ROUTE.details(item.id));
  }, [item.id]);

  return (
    <Pressable
      onPress={handleOpenDetail}
      className="p-2 rounded-lg overflow-hidden bg-slate-100 gap-1  border border-slate-300 "
      style={{
        width: dimensions.width * 0.47,
        height: dimensions.height * 0.3,
      }}
    >
      {/* Image area */}
      <View className="flex-1">
        <Image
          resizeMode="center"
          style={{ width: "100%", height: "100%" }}
          className="rounded-lg"
          source={imageUrl ? { uri: imageUrl } : undefined}
        />

        {/* Badge like "Lost/Found" */}
        <View className="absolute top-0 right-0 p-1">
          <PostStatusBadge status={item.postType} size="sm" />
        </View>
      </View>

      {/* Description section */}
      <View className="flex-col">
        <Text
          className="font-semibold text-slate-900"
          style={{ fontSize: 13 }}
          numberOfLines={1}
        >
          {item.itemName}
        </Text>

        {/* Event Time */}
        <View className="flex-row items-center gap-1">
          <ClockIcon size={16} color={colors.primary} weight="regular" />
          <Text
            className="flex-1 text-slate-700"
            style={{ fontSize: 12 }}
            numberOfLines={1}
          >
            {eventTimeLabel}
          </Text>
        </View>

        {/* Location */}
        <View className="flex-row items-center gap-1">
          <MapPinIcon size={16} color={colors.primary} weight="regular" />
          <Text
            className="flex-1 text-slate-700"
            style={{ fontSize: 12 }}
            numberOfLines={1}
          >
            {locationLabel}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};
