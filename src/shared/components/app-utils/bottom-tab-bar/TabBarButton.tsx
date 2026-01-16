import { colors, metrics } from "@/src/shared/theme";
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
  isFocused: boolean;
  Icon: React.ElementType<IconProps>;
  label: string;
  onPress: () => void;
};

export const TabBarButton = ({
  isFocused,
  Icon,
  label,
  onPress,
}: Props) => {
  const pressOpacity = useSharedValue(1);

  const handlePress = () => {
    if (Platform.OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

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
      <View style={styles.iconContainer}>
        <Icon
          weight="fill"
          size={metrics.tabBar.iconSize}
          color={isFocused ? colors["tab-bar"].active : colors["tab-bar"].inactive}
        />
      </View>

      <Text
        className={isFocused ? "text-tab-bar-active" : "text-tab-bar-inactive"}
        style={[
          styles.label,
          {
            fontSize: metrics.tabBar.labelSize,
            fontWeight: isFocused ? "800" : "600",
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
