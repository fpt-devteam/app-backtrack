import React, { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface AccordionProps {
  isExpanded: boolean;
  onToggle: () => void;
  collapsedContent: React.ReactNode;
  expandedContent: React.ReactNode;
}

const DURATION = 200;

export const AppAccordion = ({
  isExpanded,
  onToggle,
  collapsedContent,
  expandedContent,
}: AccordionProps) => {
  const [contentHeight, setContentHeight] = useState(0);
  const animHeight = useSharedValue(0);

  useEffect(() => {
    if (contentHeight > 0) {
      animHeight.value = withTiming(isExpanded ? contentHeight : 0, {
        duration: DURATION,
        easing: Easing.out(Easing.ease),
      });
    }
  }, [isExpanded, contentHeight, animHeight]);

  const animStyle = useAnimatedStyle(() => ({
    height: animHeight.value,
  }));

  return (
    <View>
      <Pressable onPress={onToggle}>{collapsedContent}</Pressable>
      <Animated.View style={[{ overflow: "hidden" }, animStyle]}>
        {/*
         * position: absolute takes this view out of Yoga's normal flow so it
         * computes its natural height independently, regardless of the parent
         * Animated.View's current height (which starts at 0). Without this,
         * Yoga would constrain the child to height 0 and onLayout would never
         * report the real content height.
         */}
        <View
          style={{ position: "absolute", top: 0, left: 0, right: 0 }}
          onLayout={(e) => {
            const h = e.nativeEvent.layout.height;
            if (h > 0) setContentHeight(h);
          }}
        >
          {expandedContent}
        </View>
      </Animated.View>
    </View>
  );
};
