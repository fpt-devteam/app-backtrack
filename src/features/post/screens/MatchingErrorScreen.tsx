import { colors } from "@/src/shared/theme";
import { router } from "expo-router";
import { ArrowClockwiseIcon, WarningCircleIcon } from "phosphor-react-native";
import React, { useEffect, useMemo, useRef } from "react";
import { Animated, Easing, Pressable, Text, View } from "react-native";

type Props = {
  title?: string;
  subtitle?: string;
  hint?: string;
  errorMessage?: string;
  onRetry?: () => void | Promise<void>;
  onCancel?: () => void;
  showCancel?: boolean;
  retryText?: string;
  cancelText?: string;
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
    outputRange: [0.18, 0.12, 0],
  });

  return (
    <Animated.View
      pointerEvents="none"
      className="absolute rounded-full border border-red-500/30"
      style={{
        width: size,
        height: size,
        opacity,
        transform: [{ scale }],
      }}
    />
  );
}

export const MatchingErrorScreen = ({
  title = "We couldn’t complete the match",
  subtitle = "Something went wrong while checking Lost & Found posts.",
  hint = "Please try again in a moment.",
  errorMessage,
  onRetry,
  onCancel,
  showCancel = true,
  retryText = "Try again",
  cancelText = "Back",
}: Props) => {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 700,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 700,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

    pulseLoop.start();
    return () => pulseLoop.stop();
  }, [pulse]);

  const iconScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.98, 1.06],
  });

  const glowOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.12, 0.22],
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

  const handleRetry = async () => {
    await onRetry?.();
  };

  return (
    <View className="flex-1 bg-canvas items-center justify-center px-6">
      {/* Center animation */}
      <View className="items-center justify-center">
        {ripples.map((r) => (
          <Ripple key={r.delayMs} delayMs={r.delayMs} size={r.size} />
        ))}

        <Animated.View
          pointerEvents="none"
          className="absolute rounded-full bg-red-500/15"
          style={{
            width: 96,
            height: 96,
            opacity: glowOpacity,
            transform: [{ scale: iconScale }],
          }}
        />

        <Animated.View
          className="w-20 h-20 rounded-2xl bg-surface border border-divider items-center justify-center shadow-sm"
          style={{ transform: [{ scale: iconScale }] }}
        >
          <WarningCircleIcon size={36} color={colors.slate[900]} weight="fill" />
        </Animated.View>
      </View>

      {/* Text block */}
      <View className="mt-8 items-center">
        <Text className="text-base font-extrabold text-textPrimary">{title}</Text>
        <Text className="mt-2 text-sm text-textSecondary text-center leading-5">
          {subtitle}
        </Text>
        <Text className="mt-2 text-xs text-textSecondary text-center">{hint}</Text>

        {!!errorMessage && (
          <View className="mt-3 px-3 py-2 rounded-xl bg-surface border border-divider">
            <Text className="text-[11px] text-textSecondary text-center">
              {errorMessage}
            </Text>
          </View>
        )}
      </View>

      {/* Actions */}
      <View className="mt-7 w-full gap-3">
        <Pressable
          onPress={handleRetry}
          className="self-center flex-row items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 active:bg-slate-800"
        >
          <ArrowClockwiseIcon size={18} color="white" weight="bold" />
          <Text className="text-sm font-semibold text-white">{retryText}</Text>
        </Pressable>

        {showCancel && (
          <Pressable
            onPress={handleCancel}
            className="self-center px-5 py-2.5 rounded-full bg-slate-100 active:bg-slate-200 border border-divider"
          >
            <Text className="text-sm font-semibold text-slate-700">
              {cancelText}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};
