import { PostType } from "@/src/features/post/types";
import { colors } from "@/src/shared/theme/colors";
import { BinocularsIcon, HandHeartIcon } from "phosphor-react-native";
import React from "react";
import { View } from "react-native";

const ICON_SIZE = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
};

const CONTAINER_SIZE = {
  xs: 20,
  sm: 24,
  md: 32,
  lg: 40,
};

type PostTypeIconBadgeProps = {
  status: PostType;
  size?: "xs" | "sm" | "md" | "lg";
};

export const PostTypeIconBadge = ({
  status,
  size = "sm",
}: PostTypeIconBadgeProps) => {
  const bgColor = status === PostType.Lost ? colors.primary : colors.babu[300];
  const dimension = CONTAINER_SIZE[size];

  return (
    <View
      className="items-center justify-center rounded-full border border-muted shadow-xs"
      style={{
        backgroundColor: bgColor,
        width: dimension,
        height: dimension,
      }}
    >
      {status === PostType.Lost ? (
        <BinocularsIcon
          size={ICON_SIZE[size]}
          color={colors.white}
          weight="duotone"
        />
      ) : (
        <HandHeartIcon
          size={ICON_SIZE[size]}
          color={colors.white}
          weight="duotone"
        />
      )}
    </View>
  );
};
