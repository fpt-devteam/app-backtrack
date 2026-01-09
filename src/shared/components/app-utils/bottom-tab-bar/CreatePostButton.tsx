import * as Haptics from "expo-haptics";
import { PlusCircleIcon } from "phosphor-react-native";
import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { metrics } from "@/src/shared/theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = {
  onPress: () => void;
  isFocused: boolean;
};

export const CreatePostButton = ({ onPress, isFocused }: Props) => {
  const pressOpacity = useSharedValue(1);
  const scale = useSharedValue(1);

  const handlePress = () => {
    if (Platform.OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    pressOpacity.value = withSequence(
      withTiming(0.6, { duration: metrics.motion.press.in }),
      withTiming(1, { duration: metrics.motion.press.out })
    );
    scale.value = withSequence(
      withTiming(0.9, { duration: metrics.motion.press.in }),
      withTiming(1, { duration: metrics.motion.press.out })
    );

    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: pressOpacity.value,
    transform: [{ scale: scale.value }],
  }));

  // Match TabBarButton pattern for icon color until theme hook is available
  // Colors match global.css --tab-bar-active / --tab-bar-inactive
  const iconColor = isFocused ? "#137fec" : "#65676B";

  return (
    <AnimatedPressable
      onPress={handlePress}
      style={[styles.createButton, animatedStyle]}
      accessible
      accessibilityRole="button"
      accessibilityLabel="Create post"
      accessibilityHint="Opens menu to create new post"
    >
      {/* Active indicator line at top */}
      {isFocused && (
        <View
          className="bg-tab-bar-indicator"
          style={styles.indicator}
        />
      )}

      <View style={styles.iconContainer}>
        <View 
          style={[
            styles.iconBackground, 
            isFocused && styles.iconBackgroundActive
          ]}
        >
          <PlusCircleIcon size={metrics.tabBar.iconSize} color={iconColor} weight="regular" />
        </View>
      </View>

      <Text
        className={isFocused ? "text-tab-bar-active" : "text-tab-bar-inactive"}
        style={[
          styles.label,
          {
            fontSize: metrics.tabBar.labelSize,
            fontWeight: isFocused ? "600" : "400",
          },
        ]}
      >
        Create
      </Text>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  createButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: metrics.tabBar.padding.top,
    paddingBottom: metrics.tabBar.padding.bottom,
    position: "relative",
  },
  indicator: {
    position: "absolute",
    top: 0,
    left: "50%",
    marginLeft: -(metrics.tabBar.indicatorWidth / 2),
    width: metrics.tabBar.indicatorWidth,
    height: metrics.tabBar.indicatorHeight,
    borderRadius: metrics.tabBar.indicatorHeight / 2,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  iconBackground: {
    width: metrics.tabBar.createButton.iconBackgroundSize,
    height: metrics.tabBar.createButton.iconBackgroundSize,
    borderRadius: metrics.tabBar.createButton.iconBackgroundRadius,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  iconBackgroundActive: {
    backgroundColor: "rgba(19, 127, 236, 0.08)", // Subtle blue tint when active
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
