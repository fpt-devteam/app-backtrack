import { colors } from "@/src/shared/theme";
import * as Haptics from "expo-haptics";
import type { PhosphorLogoIcon } from "phosphor-react-native";
import React, { useMemo } from "react";
import { Platform, Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

type Tone = "primary" | "neutral" | "white";
type Size = "sm" | "md";

type FABProps = {
  readonly icon: React.ElementType<React.ComponentProps<typeof PhosphorLogoIcon>>;
  readonly label?: string;
  readonly onPress: () => void;
  readonly tone?: Tone;
  readonly size?: Size;
  readonly disabled?: boolean;
  readonly style?: ViewStyle;
};

export const FAB = ({
  icon: Icon,
  label,
  onPress,
  tone = "primary",
  size = "md",
  disabled = false,
  style,
}: FABProps) => {
  const s = useMemo(() => sizeMap[size], [size]);
  const c = useMemo(() => toneMap[tone], [tone]);
  const isPill = !!label;

  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const pressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withSpring(0.96, { damping: 18, stiffness: 260, mass: 0.35 });
    opacity.value = withTiming(0.92, { duration: 90 });
  };

  const pressOut = () => {
    scale.value = withSpring(1, { damping: 18, stiffness: 260, mass: 0.35 });
    opacity.value = withTiming(1, { duration: 120 });
  };

  return (
    <Animated.View
      style={[
        styles.base,
        styles.shadowIOS,
        { backgroundColor: c.bg, borderColor: c.border },
        isPill
          ? styles.pill
          : { width: s.btn, height: s.btn, borderRadius: s.btn / 2 },
        disabled && { opacity: 0.45 },
        animatedStyle,
        style,
      ]}
    >
      <Pressable
        onPress={onPress}
        disabled={disabled}
        onPressIn={pressIn}
        onPressOut={pressOut}
        android_ripple={
          Platform.OS === "android"
            ? { color: "rgba(0,0,0,0.08)", borderless: true }
            : undefined
        }
        style={[styles.pressable, isPill && { paddingHorizontal: 14, gap: 10 }]}
        hitSlop={12}
      >
        <Icon size={s.icon} color={c.fg} weight="bold" />
        {label ? (
          <Text style={[styles.label, { color: c.fg }]} numberOfLines={1}>
            {label}
          </Text>
        ) : null}
      </Pressable>
    </Animated.View>
  );
}

const sizeMap: Record<Size, { btn: number; icon: number }> = {
  sm: { btn: 44, icon: 20 },
  md: { btn: 56, icon: 24 },
};

const toneMap: Record<Tone, { bg: string; fg: string; border: string }> = {
  primary: { bg: colors.primary, fg: "#fff", border: "transparent" },
  neutral: { bg: colors.slate[900], fg: "#fff", border: "transparent" },
  white: { bg: "#fff", fg: colors.slate[900], border: "rgba(0,0,0,0.08)" },
};

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
    overflow: "hidden",
  },
  pill: {
    height: 56,
    borderRadius: 28,
  },
  pressable: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  shadowIOS: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOpacity: 0.18,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 10 },
    },
    android: { elevation: 8 },
    default: {},
  }) as any,
});
