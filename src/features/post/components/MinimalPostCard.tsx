import type { Post } from "@/src/features/post/types";
import { AppImage } from "@/src/shared/components";
import { POST_ROUTE } from "@/src/shared/constants";
import { colors } from "@/src/shared/theme/colors";
import { formatIsoDate } from "@/src/shared/utils";
import { router } from "expo-router";
import { ClockIcon, MapPinIcon } from "phosphor-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { PostStatusBadge } from "./PostStatusBadge";

type MinimalPostCardProps = {
  post: Post;
};

export const MinimalPostCard = ({ post }: MinimalPostCardProps) => {
  const imgUrl = post.imageUrls?.[0];

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => router.push(POST_ROUTE.details(post.id))}
      style={{
        borderWidth: 0.75,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
      }}
      className="flex-row gap-3 bg-surface rounded-2xl border border-divider p-lg"
    >
      <AppImage
        source={{ uri: imgUrl }}
        className="w-24 rounded-xl bg-slate-100 aspect-square"
      />

      <View className="flex-1 gap-2">
        <View className="flex-row justify-between items-start">
          <Text
            className="flex-1 text-lg font-normal text-textPrimary"
            numberOfLines={2}
          >
            {post.item.itemName}
          </Text>

          <PostStatusBadge status={post.postType} />
        </View>

        <View className="flex-col justify-between gap-1">
          <View className="flex-row items-center gap-2">
            <MapPinIcon size={16} color={colors.foreground} />
            <Text
              className="flex-1 text-sm text-textSecondary"
              numberOfLines={1}
            >
              {post.displayAddress}
            </Text>
          </View>

          <View className="flex-row items-center gap-2">
            <ClockIcon size={16} color={colors.foreground} />
            <Text
              className="flex-1 text-sm text-textSecondary"
              numberOfLines={1}
            >
              {formatIsoDate(post.eventTime)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
