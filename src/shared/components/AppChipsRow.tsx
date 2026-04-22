import { colors } from "@/src/shared/theme";
import React from "react";
import { Pressable, Text, View } from "react-native";

type ChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
};

export const AppChipsRow = ({ chips }: { chips: ChipProps[] }) => {
  return (
    <View className="flex-row gap-sm">
      {chips.map((chip) => (
        <Chip
          key={chip.label}
          label={chip.label}
          selected={chip.selected}
          onPress={chip.onPress}
          disabled={chip.disabled}
        />
      ))}
    </View>
  );
};

const Chip = ({ label, selected, onPress, disabled }: ChipProps) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className="px-md2 py-sm rounded-full items-center justify-center"
      style={{
        backgroundColor: selected ? colors.secondary : colors.muted,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <Text
        className="text-sm font-normal"
        style={{ color: selected ? colors.white : colors.text.main }}
      >
        {label}
      </Text>
    </Pressable>
  );
};
