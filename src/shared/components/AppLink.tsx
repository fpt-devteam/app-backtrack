import React from "react";
import { Text, TouchableOpacity } from "react-native";

type LinkSize = "sm" | "md" | "lg" | "base";

type AppLinkProps = {
  title: string;
  onPress: () => void;
  size?: LinkSize;
  disabled?: boolean;
};

export const AppLink = ({
  title,
  onPress,
  size = "md",
  disabled,
}: AppLinkProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={{ opacity: disabled ? 0.4 : 1 }}
    >
      <Text
        className={`text-${size} font-normal text-secondary text-center underline`}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};
