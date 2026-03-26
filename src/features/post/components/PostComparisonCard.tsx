import { SimilarPost, PostType } from "@/src/features/post/types";
import { colors } from "@/src/shared/theme";
import { formatDateTime } from "@/src/shared/utils";
import { CalendarBlankIcon, MapPinIcon } from "phosphor-react-native";
import React from "react";
import { Image, Text, View } from "react-native";

interface PostComparisonCardProps {
  post: SimilarPost;
}

export const PostComparisonCard = ({ post }: PostComparisonCardProps) => {
  const isLost = post.postType === PostType.Lost;

  return (
    <View className="bg-white rounded-2xl flex-1 overflow-hidden shadow-sm">
      <View className={`h-1 ${isLost ? "bg-orange-400" : "bg-emerald-500"}`} />

      <View className="p-3">
        <View
          className={`self-start px-2.5 py-0.5 rounded-full mb-2 ${isLost ? "bg-orange-100" : "bg-emerald-100"}`}
        >
          <Text
            className={`text-[10px] font-bold tracking-wider ${isLost ? "text-orange-600" : "text-emerald-600"}`}
          >
            {isLost ? "LOST" : "FOUND"}
          </Text>
        </View>

        {post.images.length > 0 ? (
          <View className="rounded-xl overflow-hidden bg-slate-100 aspect-square mb-3">
            <Image
              source={{ uri: post.images[0].url }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
        ) : (
          <View className="rounded-xl bg-slate-100 aspect-square mb-3 items-center justify-center">
            <Text className="text-slate-300 text-3xl">📦</Text>
          </View>
        )}

        <Text className="text-slate-900 font-bold text-sm" numberOfLines={2}>
          {post.itemName}
        </Text>

        {post.displayAddress ? (
          <View className="flex-row items-center mt-1.5 gap-1">
            <MapPinIcon size={11} color={colors.slate[400]} />
            <Text className="text-slate-400 text-xs flex-1" numberOfLines={1}>
              {post.displayAddress}
            </Text>
          </View>
        ) : null}

        <View className="flex-row items-center mt-1 gap-1">
          <CalendarBlankIcon size={11} color={colors.slate[400]} />
          <Text className="text-slate-400 text-xs flex-1" numberOfLines={1}>
            {formatDateTime(post.eventTime)}
          </Text>
        </View>
      </View>
    </View>
  );
};
