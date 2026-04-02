import type { PostSuggestion } from "@/src/features/post/types";
import React, { useCallback } from "react";
import { Image, Pressable, Text, useWindowDimensions } from "react-native";

type PostSuggestionCardProps = {
  item: PostSuggestion;
  onPress?: () => void;
};

export const PostSuggestionCard = ({
  item,
  onPress,
}: PostSuggestionCardProps) => {
  const imageUrl = item.imageUrl;
  const dimensions = useWindowDimensions();

  const handleOpenDetail = useCallback(() => {
    onPress?.();
  }, [onPress]);

  return (
    <Pressable
      onPress={handleOpenDetail}
      className="p-2 rounded-lg overflow-hidden gap-2 border border-divider"
      style={{
        width: dimensions.width * 0.45,
      }}
    >
      {/* Image area */}
      <Image
        resizeMode="cover"
        style={{ width: "100%" }}
        className="rounded-lg aspect-square"
        source={imageUrl ? { uri: imageUrl } : undefined}
      />

      {/* Description section */}
      <Text
        className="text-sm font-medium text-center text-textPrimary"
        numberOfLines={2}
      >
        {item.itemName}
      </Text>
    </Pressable>
  );
};
