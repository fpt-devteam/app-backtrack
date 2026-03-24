import { colors } from "@/src/shared/theme";
import React from "react";
import { Pressable, Text, View } from "react-native";

type ConversationChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export const ConversationChipsRow = ({
  chips,
}: {
  chips: ConversationChipProps[];
}) => {
  return (
    <View className="flex-row" style={{ gap: 8 }}>
      {chips.map((chip, index) => (
        <Chip
          key={index}
          label={chip.label}
          selected={chip.selected}
          onPress={chip.onPress}
        />
      ))}
    </View>
  );
};

const Chip = ({ label, selected, onPress }: ConversationChipProps) => {
  return (
    <Pressable
      onPress={onPress}
      className="mr-2 h-9 px-4 rounded-full items-center justify-center"
      style={{
        backgroundColor: selected ? colors.blue[500] : colors.slate[100],
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
