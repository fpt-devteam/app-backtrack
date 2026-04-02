import { PostType } from "@/src/features/post/types";
import React from "react";
import { Text, View } from "react-native";

type BadgeSize = "sm" | "md" | "lg";

type PostStatusBadgeProps = {
  status: PostType;
  size?: BadgeSize;
};

const SIZE_STYLES: Record<BadgeSize, { container: string; text: string }> = {
  sm: {
    container: "px-2 py-1 gap-1",
    text: "text-[10px]",
  },
  md: {
    container: "px-2.5 py-1.5 gap-1.5",
    text: "text-xs",
  },
  lg: {
    container: "px-3 py-2 gap-2",
    text: "text-sm",
  },
};

export const PostStatusBadge = ({
  status,
  size = "md",
}: PostStatusBadgeProps) => {
  const s = SIZE_STYLES[size];

  if (status === PostType.Lost) {
    return (
      <View
        className={`flex-row items-center rounded-full bg-orange-100 ${s.container}`}
      >
        <Text className={`font-bold text-orange-800 ${s.text}`}>Lost</Text>
      </View>
    );
  }

  if (status === PostType.Found) {
    return (
      <View
        className={`flex-row items-center rounded-full bg-green-100 ${s.container}`}
      >
        <Text className={`font-bold text-green-800 ${s.text}`}>Found</Text>
      </View>
    );
  }

  return (
    <View
      className={`flex-row items-center rounded-full bg-slate-200 ${s.container}`}
    >
      <Text className={`font-bold text-slate-700 ${s.text}`}>Resolved</Text>
    </View>
  );
};
