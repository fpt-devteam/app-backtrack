import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, Image, ImageSourcePropType, Pressable, Text, View } from "react-native";

type LoaderProps = {
  loading: boolean;
  icon?: ImageSourcePropType;
  height?: number;
  variant?: "full" | "footer";
  error?: boolean;
  onRetry?: () => void;
  endMessage?: string;
};

const FADE_IN_DELAY_MS = 200;

const Loader = ({
  loading,
  icon = require("@/assets/images/splash-icon.png"),
  height = 84,
  variant = "full",
  error = false,
  onRetry,
  endMessage,
}: LoaderProps) => {
  const containerOpacity = useRef(new Animated.Value(0)).current;
  const iconScale = useRef(new Animated.Value(1)).current;
  const iconOpacity = useRef(new Animated.Value(1)).current;
  const sweep = useRef(new Animated.Value(0)).current;

  const pulseLoop = useRef<Animated.CompositeAnimation | null>(null);
  const sweepLoop = useRef<Animated.CompositeAnimation | null>(null);
  const fadeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    const stop = () => {
      pulseLoop.current?.stop();
      sweepLoop.current?.stop();
      pulseLoop.current = null;
      sweepLoop.current = null;
      if (fadeTimeout.current) {
        clearTimeout(fadeTimeout.current);
        fadeTimeout.current = null;
      }
    };

    if (loading) {
      fadeTimeout.current = setTimeout(() => {
        setShouldShow(true);
        Animated.timing(containerOpacity, {
          toValue: 1,
          duration: 140,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }).start();
      }, FADE_IN_DELAY_MS);

      iconScale.setValue(1);
      iconOpacity.setValue(1);
      sweep.setValue(0);

      pulseLoop.current = Animated.loop(
        Animated.sequence([
          Animated.timing(iconScale, {
            toValue: 1.1,
            duration: 520,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(iconScale, {
            toValue: 0.95,
            duration: 520,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      );
      pulseLoop.current.start();

      sweepLoop.current = Animated.loop(
        Animated.timing(sweep, {
          toValue: 1,
          duration: 850,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        })
      );
      sweepLoop.current.start();
    } else {
      stop();
      setShouldShow(false);
      Animated.parallel([
        Animated.timing(iconOpacity, {
          toValue: 0,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(containerOpacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start(() => {
        iconOpacity.setValue(1);
        iconScale.setValue(1);
        sweep.setValue(0);
      });
    }

    return stop;
  }, [loading, containerOpacity, iconOpacity, iconScale, sweep]);

  const sweepTranslate = sweep.interpolate({
    inputRange: [0, 1],
    outputRange: [-120, 120],
  });

  if (error && onRetry) {
    return (
      <View style={{ height }} className="items-center justify-center">
        <Pressable
          onPress={onRetry}
          className="px-6 py-3 bg-slate-100 rounded-full active:bg-slate-200"
        >
          <Text className="text-sm font-semibold text-slate-700">
            Failed to load. Tap to retry
          </Text>
        </Pressable>
      </View>
    );
  }

  if (endMessage) {
    return (
      <View style={{ height }} className="items-center justify-center">
        <Text className="text-sm text-slate-500">{endMessage}</Text>
      </View>
    );
  }

  if (!shouldShow && !loading) {
    return null;
  }

  const footerHeight = variant === "footer" ? 64 : height;

  return (
    <View style={{ height: footerHeight }}>
      <Animated.View
        className="flex-1 items-center justify-center gap-2"
        style={{ opacity: containerOpacity }}
      >
        <Animated.View
          style={{ transform: [{ scale: iconScale }], opacity: iconOpacity }}
        >
          <Image
            source={icon}
            resizeMode="contain"
            className="w-7 h-7"
          />
        </Animated.View>

        <View className="w-[60%] max-w-[260px] h-1.5 rounded-full bg-slate-200 overflow-hidden">
          <Animated.View
            className="absolute left-1/2 w-[40%] h-full rounded-full bg-blue-500"
            style={{ transform: [{ translateX: sweepTranslate }] }}
          />
        </View>
      </Animated.View>
    </View>
  );
};
export default Loader;
