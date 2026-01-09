import { colors } from "@/src/shared/theme";
import { router } from "expo-router";
import { MagnifyingGlass } from "phosphor-react-native";
import React, { useEffect, useMemo, useRef } from "react";
import { Animated, Easing, Pressable, Text, View } from "react-native";

type Props = {
  title?: string;
  subtitle?: string;
  hint?: string;
  onCancel?: () => void;
  showCancel?: boolean;
};

type RippleProps = {
  delayMs: number;
  size: number;
};

function Ripple({ delayMs, size }: RippleProps) {
  const t = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const start = () => {
      t.setValue(0);
      Animated.timing(t, {
        toValue: 1,
        duration: 1400,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start(() => start());
    };

    const timeout = setTimeout(start, delayMs);
    return () => clearTimeout(timeout);
  }, [delayMs, t]);

  const scale = t.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 2.2],
  });

  const opacity = t.interpolate({
    inputRange: [0, 0.25, 1],
    outputRange: [0.22, 0.14, 0],
  });

  return (
    <Animated.View
      pointerEvents="none"
      className="absolute rounded-full border border-blue-500/30"
      style={{
        width: size,
        height: size,
        opacity,
        transform: [{ scale }],
      }}
    />
  );
}

const MatchingWaitingScreen = ({
  title = "Matching in progress",
  subtitle = "We’re comparing Lost & Found posts near you",
  hint = "This usually takes a few seconds…",
  onCancel,
  showCancel = true,
}: Props) => {
  const pulse = useRef(new Animated.Value(0)).current;
  const wiggle = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 620,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 620,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

    const wiggleLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(wiggle, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(wiggle, {
          toValue: 0,
          duration: 900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

    pulseLoop.start();
    wiggleLoop.start();
    return () => {
      pulseLoop.stop();
      wiggleLoop.stop();
    };
  }, [pulse, wiggle]);

  const iconScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.95, 1.08],
  });

  const iconRotate = wiggle.interpolate({
    inputRange: [0, 1],
    outputRange: ["-8deg", "8deg"],
  });

  const glowOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.16, 0.28],
  });

  const ripples = useMemo(
    () => [
      { delayMs: 0, size: 140 },
      { delayMs: 350, size: 140 },
      { delayMs: 700, size: 140 },
    ],
    []
  );

  const handleCancel = () => {
    if (onCancel) return onCancel();
    router.back();
  };

  return (
    <View className="flex-1 bg-slate-50 items-center justify-center px-6">
      {/* Center animation */}
      <View className="items-center justify-center">
        {/* Ripples */}
        {ripples.map((r) => (
          <Ripple key={r.delayMs} delayMs={r.delayMs} size={r.size} />
        ))}

        {/* Soft glow */}
        <Animated.View
          pointerEvents="none"
          className="absolute rounded-full bg-blue-500/20"
          style={{
            width: 96,
            height: 96,
            opacity: glowOpacity,
            transform: [{ scale: iconScale }],
          }}
        />

        {/* Magnifier bubble */}
        <Animated.View
          className="w-20 h-20 rounded-2xl bg-white border border-slate-200 items-center justify-center shadow-sm"
          style={{
            transform: [{ scale: iconScale }, { rotate: iconRotate }],
          }}
        >
          <MagnifyingGlass size={34} color={colors.slate[900]} />
        </Animated.View>
      </View>

      {/* Text block */}
      <View className="mt-8 items-center">
        <Text className="text-base font-extrabold text-slate-900">{title}</Text>
        <Text className="mt-2 text-sm text-slate-600 text-center leading-5">
          {subtitle}
        </Text>
        <Text className="mt-2 text-xs text-slate-500 text-center">
          {hint}
        </Text>
      </View>

      {/* UX add-ons */}
      <View className="mt-6 w-full gap-3">
        {/* Optional: secondary explanation chips */}
        <View className="flex-row justify-center gap-2">
          <View className="px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200">
            <Text className="text-xs font-semibold text-slate-700">Near location</Text>
          </View>
          <View className="px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200">
            <Text className="text-xs font-semibold text-slate-700">Smart match</Text>
          </View>
        </View>

        {showCancel && (
          <Pressable
            onPress={handleCancel}
            className="self-center px-5 py-2.5 rounded-full bg-slate-100 active:bg-slate-200 border border-slate-200"
          >
            <Text className="text-sm font-semibold text-slate-700">Cancel</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
export default MatchingWaitingScreen;
