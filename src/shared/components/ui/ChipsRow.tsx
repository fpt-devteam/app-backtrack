import { colors } from "@/src/shared/theme";
import React from "react";
import { Pressable, Text, View } from "react-native";

type ChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
};

export const ChipsRow = ({ chips }: { chips: ChipProps[] }) => {
  return (
    <View className="flex-row" style={{ gap: 8 }}>
      {chips.map((chip, index) => (
        <Chip
          key={index}
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
      className="mr-2 h-9 px-4 rounded-full items-center justify-center"
      style={{
        backgroundColor: selected ? colors.blue[500] : colors.slate[100],
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <Text
        className="text-sm font-semibold"
        style={{ color: selected ? "#fff" : colors.slate[900] }}
      >
        {label}
      </Text>
    </Pressable>
  );
};
