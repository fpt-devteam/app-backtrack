import { cn } from "@/src/shared/utils/cn";
import React from "react";
import { Pressable, Text } from "react-native";

type NotificationChipProps = {
  label: string;
  isActive: boolean;
  onPress: () => void;
};

export const NotificationChip = ({
  label,
  isActive,
  onPress,
}: NotificationChipProps) => {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        "px-4 py-2 rounded-full border",
        isActive ? "bg-sky-500 border-sky-500" : "bg-white border-slate-300",
      )}
    >
      <Text
        className={cn(
          "text-sm font-medium",
          isActive ? "text-white" : "text-slate-700",
        )}
      >
        {label}
      </Text>
    </Pressable>
  );
};
