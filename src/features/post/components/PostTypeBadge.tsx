import { PostType } from "@/src/features/post/types";
import React from "react";
import { Text, View } from "react-native";

const TYPE_STYLE_MAP: Record<
  PostType,
  { label: string; bgClass: string; textClass: string }
> = {
  [PostType.Lost]: {
    label: "Lost",
    bgClass: "bg-red-100",
    textClass: "text-red-800",
  },
  [PostType.Found]: {
    label: "Found",
    bgClass: "bg-cyan-100",
    textClass: "text-cyan-800",
  },
};

type PostTypeBadgeProps = {
  status: PostType;
};

export const PostTypeBadge = ({ status }: PostTypeBadgeProps) => {
  const config = TYPE_STYLE_MAP[status] || TYPE_STYLE_MAP[PostType.Found];

  return (
    <View className={`px-2.5 py-1 rounded-md ${config.bgClass}`}>
      <Text className={`text-xs font-medium capitalize ${config.textClass}`}>
        {config.label}
      </Text>
    </View>
  );
};
