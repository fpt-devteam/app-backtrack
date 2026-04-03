import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  LayoutChangeEvent,
  Pressable,
  Text,
  View,
} from "react-native";

const OPTIONS = [
  { label: "All", value: "All" },
  { label: "Found", value: "Found" },
  { label: "Lost", value: "Lost" },
];

type PostTypeSelectorProps = {
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
};

export const AppSegmentedControl = ({
  value,
  onChange,
  options = OPTIONS,
}: PostTypeSelectorProps) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const activeIndex = options.findIndex((opt) => opt.value === value);
  const tabWidth = containerWidth / options.length;

  useEffect(() => {
    if (containerWidth > 0) {
      Animated.spring(slideAnim, {
        toValue: activeIndex * tabWidth,
        useNativeDriver: true,
        bounciness: 5,
      }).start();
    }
  }, [activeIndex, containerWidth]);

  const onLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width - 8);
  };

  const handlePress = (val: string) => {
    if (val === value) return;
    onChange(val);
  };

  return (
    <View
      onLayout={onLayout}
      className="flex-row items-center bg-slate-100 rounded-sm relative h-10"
    >
      {containerWidth > 0 && (
        <Animated.View
          className="absolute bg-primary rounded-sm h-8"
          style={{
            width: tabWidth,
            transform: [{ translateX: slideAnim }],
            left: 4,
          }}
        />
      )}

      {options.map((option) => {
        const isActive = value === option.value;
        return (
          <Pressable
            key={option.value}
            onPress={() => handlePress(option.value)}
            className="flex-1 items-center justify-center z-10"
          >
            <Text
              className={`text-xs font-medium ${
                isActive ? "text-white" : "text-slate-500"
              }`}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};
