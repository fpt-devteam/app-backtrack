import React from "react";
import { Text, View } from "react-native";

type EmptyListProps = {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
};

const EmptyList = ({ title, subtitle, icon }: EmptyListProps) => {
  return (
    <View className="flex-1 items-center justify-center gap-xs">
      {/* Icon */}
      <View>{icon}</View>

      {/* Title */}
      <Text className="text-lg font-normal text-textPrimary text-center ">
        {title}
      </Text>

      {/* Subtitle  */}
      <Text className="text-sm font-thin text-textSecondary text-center">
        {subtitle}
      </Text>
    </View>
  );
};

export default EmptyList;
