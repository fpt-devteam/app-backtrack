import React, { ReactNode } from "react";
import { Text, View } from "react-native";

type UserSettingSectionCardProps = {
  icon: ReactNode;
  title: string;
  children: ReactNode;
};

export const UserSettingSectionCard = ({
  icon,
  title,
  children,
}: UserSettingSectionCardProps) => (
  <View className="bg-surface rounded-2xl border border-divider px-4 py-4 gap-1">
    <View className="flex-row items-center gap-2 mb-1">
      {icon}
      <Text className="text-sm font-bold text-textPrimary">{title}</Text>
    </View>
    {children}
  </View>
);
