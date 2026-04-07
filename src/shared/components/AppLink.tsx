import React from "react";
import { Text, TouchableOpacity } from "react-native";

type LinkSize = "sm" | "md" | "lg";

type AppLinkProps = {
  title: string;
  onPress: () => void;
  size?: LinkSize;
};

export const AppLink = ({ title, onPress, size = "md" }: AppLinkProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text
        className={`text-${size} font-normal text-secondary text-center underline`}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};
