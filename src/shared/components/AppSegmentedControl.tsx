import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  LayoutChangeEvent,
  Pressable,
  Text,
  View,
} from "react-native";

type SegmentedControlProps = {
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
};

export const AppSegmentedControl = ({
  value,
  onChange,
  options,
}: SegmentedControlProps) => {
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
  }, [activeIndex, containerWidth, tabWidth]);

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
      className="flex-row items-center bg-surface rounded-md relative border border-border p-xs"
    >
      {containerWidth > 0 && (
        <Animated.View
          className="absolute bg-secondary/5 rounded-sm border-2 h-12"
          style={{
            width: tabWidth,
            transform: [{ translateX: slideAnim }],
            left: 4,
          }}
        />
      )}

      {options.map((option, index) => {
        const showDivider =
          index < options.length - 1 &&
          activeIndex !== index &&
          activeIndex !== index + 1;

        return (
          <React.Fragment key={option.value}>
            <Pressable
              onPress={() => handlePress(option.value)}
              className="flex-1 min-h-touch items-center justify-center z-10"
            >
              <Text className="text-md font-normal text-textPrimary">
                {option.label}
              </Text>
            </Pressable>

            {index < options.length - 1 && (
              <View
                style={{ opacity: showDivider ? 1 : 0 }}
                className="h-md border-r border-border"
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
};
