import React from 'react';
import { Pressable, ScrollView, Text } from 'react-native';
import { colors } from '../../theme';

type ChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
}

const ChipsRow = ({ chips }: { chips: ChipProps[] }) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {chips.map((chip, index) => <Chip key={index} label={chip.label} selected={chip.selected} onPress={chip.onPress} />)}
    </ScrollView>
  )
}

const Chip = ({ label, selected, onPress }: ChipProps) => {
  return (
    <Pressable
      onPress={onPress}
      className="mr-2 h-9 px-4 rounded-full items-center justify-center"
      style={{ backgroundColor: selected ? colors.blue[500] : colors.slate[100] }}
    >
      <Text
        className="text-sm font-semibold"
        style={{ color: selected ? "#fff" : colors.slate[700] }}
      >
        {label}
      </Text>
    </Pressable>
  )
}

export default ChipsRow