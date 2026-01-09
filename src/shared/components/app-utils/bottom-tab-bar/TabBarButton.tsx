/**
 * Tab Bar Button
 *
 * Individual tab item with:
 * - Icon on top
 * - Label below
 * - Active indicator line at the top
 * - Press feedback
 */

import { metrics } from "@/src/shared/theme";
import type { NavigationRoute, ParamListBase } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import type { IconProps } from "phosphor-react-native";
import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = {
  route: NavigationRoute<ParamListBase, string>;
  isFocused: boolean;
  Icon: React.ElementType<IconProps>;
  label: string;
  onPress: () => void;
};

export const TabBarButton = ({
  route,
  isFocused,
  Icon,
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
      withTiming(0.6, { duration: metrics.motion.press.in }),
      withTiming(1, { duration: metrics.motion.press.out })
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
        <Icon
          weight={isFocused ? "fill" : "regular"}
          size={metrics.tabBar.iconSize}
          color={isFocused ? "#137fec" : "#65676B"} // Will be replaced by theme hook
        />
      </View>

      {/* Label */}
      <Text
        className={isFocused ? "text-tab-bar-active" : "text-tab-bar-inactive"}
        style={[
          styles.label,
          {
            fontSize: metrics.tabBar.labelSize,
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
    paddingTop: metrics.tabBar.padding.top,
    paddingBottom: metrics.tabBar.padding.bottom,
    position: "relative",
  },
  indicator: {
    position: "absolute",
    top: -8,
    left: "50%",
    marginLeft: -(metrics.tabBar.indicatorWidth / 2), // Center the indicator
    width: metrics.tabBar.indicatorWidth,
    height: metrics.tabBar.indicatorHeight,
    borderRadius: metrics.tabBar.indicatorHeight / 2,
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
