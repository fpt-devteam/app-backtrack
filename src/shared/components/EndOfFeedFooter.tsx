
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

interface EndOfFeedFooterProps {
  readonly title?: string;
  readonly hint?: string;
}

const EndOfFeedFooter = ({
  title = "You’re all caught up",
  hint = "Try changing filters or searching nearby to see more.",
}: EndOfFeedFooterProps) => {
  return (
    <View className="h-16 items-center px-4">
      <View className="flex-row items-center gap-2">
        <Ionicons name="checkmark-circle-outline" size={18} color="#64748B" />
        <Text className="text-sm font-semibold text-slate-700">{title}</Text>
      </View>

      <Text
        className="mt-1 text-xs text-slate-500 text-center"
        numberOfLines={2}
      >
        {hint}
      </Text>
    </View>
  );
}

export default EndOfFeedFooter;
