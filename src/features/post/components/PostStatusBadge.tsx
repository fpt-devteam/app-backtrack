import { POST_STATUS, PostStatus } from "@/src/features/post/types/post.type";
import { colors } from "@/src/shared/theme";
import React from "react";
import { Text, View } from "react-native";

type PostStatusBadgeProps = {
  status: PostStatus;
};

type StatusTheme = {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
};

const STATUS_THEME: Record<PostStatus, StatusTheme> = {
  [POST_STATUS.ACTIVE]: {
    label: "Active",
    color: colors.babu[500],
    bgColor: colors.babu[100],
    borderColor: colors.babu[200],
  },
  [POST_STATUS.RETURNED]: {
    label: "Returned",
    color: colors.babu[600],
    bgColor: colors.babu[100],
    borderColor: colors.babu[200],
  },
  [POST_STATUS.ARCHIVED]: {
    label: "Archived",
    color: colors.hof[600],
    bgColor: colors.hof[100],
    borderColor: colors.hof[300],
  },
  [POST_STATUS.EXPIRED]: {
    label: "Expired",
    color: colors.error[500],
    bgColor: colors.error[100],
    borderColor: colors.error[500],
  },
};

export const PostStatusBadge = ({ status }: PostStatusBadgeProps) => {
  const theme = STATUS_THEME[status];

  return (
    <View
      className="self-start mt-xs mb-xs px-sm py-0.5 rounded-full flex-row items-center gap-1"
      style={{
        backgroundColor: theme.bgColor,
        borderColor: theme.borderColor,
        borderWidth: 1,
      }}
    >
      <View
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: theme.color }}
      />
      <Text className="text-xs font-normal" style={{ color: theme.color }}>
        {theme.label}
      </Text>
    </View>
  );
};
