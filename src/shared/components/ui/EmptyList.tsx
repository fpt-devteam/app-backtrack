import React from "react";
import { Text, View } from "react-native";

type EmptyListProps = {
  title?: string;
  subtitle?: string;
  backButton?: React.ReactNode;
  icon?: React.ReactNode;
};

const EmptyList = ({ title, subtitle, backButton, icon }: EmptyListProps) => {
  return (
    <View className="flex-1 p-6 items-center justify-center">
      {/* Icon */}
      <View className="mb-4">{icon}</View>

      {/* Title */}
      <Text className="mt-2 text-lg font-extrabold text-textPrimary text-center ">
        {title}
      </Text>

      {/* Subtitle  */}
      <Text className="mt-4 text-base  font-normal text-textSecondary text-center ">
        {subtitle}
      </Text>

      {/* CTA spacing like Reddit */}
      {backButton ? <View className="mt-7">{backButton}</View> : null}
    </View>
  );
};

export default EmptyList;
