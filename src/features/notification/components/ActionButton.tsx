import { colors } from "@/src/shared/theme";
import React from "react";
import { Pressable, Text, View } from "react-native";

type ActionButtonProps = {
  label: string;
  icon: React.ElementType;
  onPress: () => void;
};

export const ActionButton = React.memo(
  ({ label, icon: Icon, onPress }: ActionButtonProps) => {
    return (
      <Pressable
        onPress={onPress}
        className="flex-row items-center bg-gray-50 rounded-2xl p-4"
        style={({ pressed }) => ({
          opacity: pressed ? 0.6 : 1,
        })}
      >
        <View
          className="w-10 h-10 rounded-full items-center justify-center mr-3"
          style={{ backgroundColor: colors.slate[100] }}
        >
          <Icon size={20} color={colors.slate[700]} weight="regular" />
        </View>
        <Text className="text-base font-semibold text-gray-900">{label}</Text>
      </Pressable>
    );
  },
);

ActionButton.displayName = "ActionButton";
