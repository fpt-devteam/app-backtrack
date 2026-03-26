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
  colors?: string[];
};

const ColorSwatches = ({
  onSelectColor,
  selectedColor,
  colors = DEFAULT_COLOR_SWATCHES,
}: ColorSwatchesProps) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 10, paddingRight: 6 }}
    >
      {colors.map((color) => {
        const isSelected = selectedColor?.toLowerCase() === color.toLowerCase();

        return (
          <Pressable
            key={color}
            onPress={() => onSelectColor(color)}
            className="items-center justify-center rounded-full"
            style={{
              width: 34,
              height: 34,
              borderWidth: 2,
              borderColor: isSelected ? "#84CC16" : "transparent",
            }}
          >
            <View
              className="rounded-full"
              style={{
                width: 26,
                height: 26,
                backgroundColor: color,
                borderWidth: color.toLowerCase() === "#f5f5f5" ? 1 : 0,
                borderColor: "#D1D5DB",
              }}
            />
          </Pressable>
        );
      })}
    </ScrollView>
  );
};

export default ColorSwatches;
