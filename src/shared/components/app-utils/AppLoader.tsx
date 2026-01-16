import React, { useEffect, useRef } from "react";
import { Animated, Easing, View } from "react-native";

type LoaderProps = {
  readonly size?: number;
  readonly gap?: number;
  readonly colorClass?: string;
};

export function AppLoader({
  size = 28,
  gap = 6,
  colorClass = "bg-primary",
}: LoaderProps) {
  const t = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.timing(t, {
        toValue: 1,
        duration: 900,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      })
    );
    anim.start();
    return () => anim.stop();
  }, [t]);

  const rotate = t.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const spread = t.interpolate({
    inputRange: [0, 0.35, 0.65, 1],
    outputRange: [0, 1, 1, 0],
  });

  const dx = Animated.multiply(spread, gap);
  const dy = Animated.multiply(spread, gap);

  const s = Math.floor((size - 2) / 2);

  return (
    <View className="items-center justify-center mt-4 mb-4">
      <Animated.View
        style={{
          width: size,
          height: size,
          transform: [{ rotate }],
        }}
        className="items-center justify-center"
      >
        {/* 4 squares in a 2x2 grid, each animates outwards */}
        <View
          style={{ width: size, height: size }}
          className="relative"
        >
          {/* top-left */}
          <Animated.View
            className={`absolute rounded-[4px] ${colorClass}`}
            style={{
              width: s,
              height: s,
              left: (size / 2) - s,
              top: (size / 2) - s,
              transform: [
                { translateX: Animated.multiply(dx, -1) },
                { translateY: Animated.multiply(dy, -1) },
              ],
            }}
          />

          {/* top-right */}
          <Animated.View
            className={`absolute rounded-[4px] ${colorClass}`}
            style={{
              width: s,
              height: s,
              left: size / 2,
              top: (size / 2) - s,
              transform: [
                { translateX: dx },
                { translateY: Animated.multiply(dy, -1) },
              ],
            }}
          />

          {/* bottom-left */}
          <Animated.View
            className={`absolute rounded-[4px] ${colorClass}`}
            style={{
              width: s,
              height: s,
              left: (size / 2) - s,
              top: size / 2,
              transform: [
                { translateX: Animated.multiply(dx, -1) },
                { translateY: dy },
              ],
            }}
          />

          {/* bottom-right */}
          <Animated.View
            className={`absolute rounded-[4px] ${colorClass}`}
            style={{
              width: s,
              height: s,
              left: size / 2,
              top: size / 2,
              transform: [{ translateX: dx }, { translateY: dy }],
            }}
          />
        </View >
      </Animated.View >
    </View >
  );
}

