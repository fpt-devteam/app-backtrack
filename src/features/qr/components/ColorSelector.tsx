import { colors } from "@/src/shared/theme";
import React from "react";
import { Pressable, ScrollView, View } from "react-native";

const DEFAULT_COLOR_SWATCHES = [
  "#000000",
  "#f43f5e",
  "#fcd34d",
  "#f97316",
  "#60a5fa",
  "#a78bfa",
  "#2dd4bf",
  "#1f1f1f",
  "#f5f5f5",
  "#0ea5e9",
  "#ef4444",
  "#10b981",
  "#7c3aed",
];

type ColorSwatchesProps = {
  onSelectColor: (color: string) => void;
  selectedColor?: string;
  title?: string;
};

const ColorSwatches = ({
  onSelectColor,
  selectedColor,
}: ColorSwatchesProps) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {DEFAULT_COLOR_SWATCHES.map((color) => {
        const isSelected = selectedColor?.toLowerCase() === color.toLowerCase();

        return (
          <Pressable
            key={color}
            onPress={() => onSelectColor(color)}
            className="items-center justify-center rounded-full"
            style={{
              width: 36,
              height: 36,
              borderWidth: 1,
              borderColor: isSelected ? colors.status.success : "transparent",
            }}
          >
            <View
              className="rounded-full"
              style={{
                width: 24,
                height: 24,
                backgroundColor: color,
              }}
            />
          </Pressable>
        );
      })}
    </ScrollView>
  );
};

export default ColorSwatches;
