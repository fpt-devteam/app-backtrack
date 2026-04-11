import { PostType } from "@/src/features/post/types";
import { colors } from "@/src/shared/theme/colors";
import { BinocularsIcon, HandHeartIcon } from "phosphor-react-native";
import React from "react";
import { View } from "react-native";

const SIZE = {
  sm: 16,
  md: 20,
  lg: 24,
};

type PostStatusBadgeProps = {
  status: PostType;
  size?: "sm" | "md" | "lg";
};

export const PostStatusBadge = ({
  status,
  size = "sm",
}: PostStatusBadgeProps) => {
  const bgColor =
    status === PostType.Lost ? colors.primary : colors.babu[300];

  return (
    <View
      className="flex-row items-center rounded-full p-1 shadow-xs border border-muted"
      style={{ backgroundColor: bgColor }}
    >
      {status === PostType.Lost ? (
        <BinocularsIcon
          size={SIZE[size]}
          color={colors.white}
          weight="duotone"
        />
      ) : (
        <HandHeartIcon
          size={SIZE[size]}
          color={colors.white}
          weight="duotone"
        />
      )}
    </View>
  );
};
