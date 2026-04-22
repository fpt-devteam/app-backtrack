import { POST_CATEGORIES, PostCategory } from "@/src/features/post/types";
import React from "react";
import { Text, View } from "react-native";

const CATEGORY_STYLE_MAP: Record<
  PostCategory,
  { label: string; bgClass: string; textClass: string }
> = {
  [POST_CATEGORIES.ELECTRONICS]: {
    label: "Electronics",
    bgClass: "bg-blue-100",
    textClass: "text-blue-800",
  },
  [POST_CATEGORIES.CARD]: {
    label: "Cards",
    bgClass: "bg-purple-100",
    textClass: "text-purple-800",
  },
  [POST_CATEGORIES.PERSONAL_BELONGINGS]: {
    label: "Personal Belongings",
    bgClass: "bg-emerald-100",
    textClass: "text-emerald-800",
  },
  [POST_CATEGORIES.OTHER]: {
    label: "Other",
    bgClass: "bg-gray-100",
    textClass: "text-gray-800",
  },
};

type PostCategoryBadgeProps = {
  category: PostCategory;
};

export const PostCategoryBadge = ({ category }: PostCategoryBadgeProps) => {
  const config =
    CATEGORY_STYLE_MAP[category] || CATEGORY_STYLE_MAP[POST_CATEGORIES.OTHER];

  return (
    <View className={`px-2.5 py-1 rounded-md ${config.bgClass}`}>
      <Text className={`text-xs font-medium capitalize ${config.textClass}`}>
        {config.label}
      </Text>
    </View>
  );
};
