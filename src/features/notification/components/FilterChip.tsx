import { colors } from "@/src/shared/theme";
import React from "react";
import { Pressable, Text } from "react-native";

type FilterChipProps = {
  label: string;
  isSelected: boolean;
  onPress: () => void;
};

export const FilterChip = React.memo(
  ({ label, isSelected, onPress }: FilterChipProps) => {
    const getBackgroundColor = (pressed: boolean) => {
      if (isSelected) return colors.primary;
      if (pressed) return colors.slate[100];
      return colors.slate[50];
    };

    return (
      <Pressable
        onPress={onPress}
        className="px-4 py-2 rounded-full"
        style={({ pressed }) => ({
          backgroundColor: getBackgroundColor(pressed),
          opacity: pressed ? 0.8 : 1,
        })}
      >
        <Text
          className="text-sm"
          style={{
            color: isSelected ? colors.white : colors.slate[700],
            fontWeight: isSelected ? "600" : "500",
          }}
        >
          {label}
        </Text>
      </Pressable>
    );
  },
);

FilterChip.displayName = "FilterChip";
