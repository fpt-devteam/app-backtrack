import { timeSincePast } from "@/src/shared/utils";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useMemo } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { PREFIX_PATH_POST } from "../constants/post.constant";
import { Post } from "../types";
import PostStatusBadge from "./PostStatusBadge";

interface PostCardProps {
  item: Post;
}

const PostCard = ({ item }: PostCardProps) => {
  const postedAgo = useMemo(() => timeSincePast(item.createdAt), [item.createdAt]);
  const imageUrl = item.imageUrls?.[0];

  const handleOpenDetail = useCallback(() => {
    router.push(`${PREFIX_PATH_POST}/${item.id}`);
  }, [item.id]);

  return (
    <Pressable
      onPress={handleOpenDetail}
      className="bg-white rounded-[18px] overflow-hidden border border-slate-300 shadow-lg m-4"
      style={{
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 3,
      }}
    >
      {/* Image header */}
      <View className="relative">
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            className="w-full h-[170px]"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-[170px] bg-slate-200" />
        )}
      </View>

      {/* Content */}
      <View className="p-4 gap-2">
        <View className="flex-row items-center justify-between gap-2.5">
          <Text className="text-base font-extrabold text-slate-900 flex-1" numberOfLines={1}>
            {item.itemName}
          </Text>
          <PostStatusBadge status={item.postType} />
        </View>

        <Text className="text-[13px] leading-[18px] text-slate-500" numberOfLines={2}>
          {item.description}
        </Text>

        {/* Meta rows */}
        <View className="flex-row items-center gap-2">
          <Ionicons name="location-outline" size={16} color="#64748B" />
          <Text className="flex-1 text-[13px] text-slate-600" numberOfLines={1}>
            {item.displayAddress ?? "Near here"}
          </Text>
        </View>

        <View className="flex-row items-center gap-2">
          <Ionicons name="time-outline" size={16} color="#64748B" />
          <Text className="flex-1 text-[13px] text-slate-600">Posted {postedAgo}</Text>
        </View>
      </View>
    </Pressable>
  );
};

export default PostCard;
