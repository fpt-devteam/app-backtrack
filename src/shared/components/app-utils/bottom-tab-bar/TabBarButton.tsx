/**
 * Tab Bar Button
 *
 * Individual tab item with:
 * - Icon on top
 * - Label below
 * - Active indicator line at the top
 * - Press feedback
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable, Text, StyleSheet, View, Platform } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
} from "react-native-reanimated";
import { TAB_BAR, MOTION } from "@/src/shared/theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type IconName = keyof typeof Ionicons.glyphMap;

type Props = {
  route: any;
  isFocused: boolean;
  activeIcon: IconName;
  inactiveIcon: IconName;
  label: string;
  onPress: () => void;
};

export const TabBarButton = ({
  route,
  isFocused,
  activeIcon,
  inactiveIcon,
  label,
  onPress,
}: Props) => {
  const pressOpacity = useSharedValue(1);

  const handlePress = () => {
    // Haptic feedback on press
    if (Platform.OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Quick press animation
    pressOpacity.value = withSequence(
      withTiming(0.6, { duration: MOTION.press.in }),
      withTiming(1, { duration: MOTION.press.out })
    );

    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: pressOpacity.value,
  }));

  return (
    <AnimatedPressable
      onPress={handlePress}
      style={[styles.tabButton, animatedStyle]}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`${label} tab`}
      accessibilityState={{ selected: isFocused }}
    >
      {/* Active indicator line at top */}
      {isFocused && (
        <View
          className="bg-tab-bar-indicator"
          style={styles.indicator}
        />
      )}

      {/* Icon */}
      <View style={styles.iconContainer}>
        <Ionicons
          name={isFocused ? activeIcon : inactiveIcon}
          size={TAB_BAR.iconSize}
          color={isFocused ? "#137fec" : "#65676B"} // Will be replaced by theme hook
        />
      </View>

      {/* Label */}
      <Text
        className={isFocused ? "text-tab-bar-active" : "text-tab-bar-inactive"}
        style={[
          styles.label,
          {
            fontSize: TAB_BAR.labelSize,
            fontWeight: isFocused ? "600" : "400",
          },
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: TAB_BAR.padding.top,
    paddingBottom: TAB_BAR.padding.bottom,
    position: "relative",
  },
  indicator: {
    position: "absolute",
    top: 0,
    left: "50%",
    marginLeft: -(TAB_BAR.indicatorWidth / 2), // Center the indicator
    width: TAB_BAR.indicatorWidth,
    height: TAB_BAR.indicatorHeight,
    borderRadius: TAB_BAR.indicatorHeight / 2,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  label: {
    fontFamily: Platform.select({
      ios: "System",
      android: "Roboto",
      default: "System",
    }),
    textAlign: "center",
  },
});
