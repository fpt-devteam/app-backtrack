import React from "react";
import { View } from "react-native";

import { MotiView } from "moti";

type AppLoaderProps = {
  readonly dotSize?: number;
  readonly colorClass?: string;
  readonly bounceHeight?: number;
};

const DOT_DELAYS = [0, 150, 300];

export function AppLoader({
  dotSize = 6,
  colorClass = "bg-primary",
  bounceHeight = 6,
}: AppLoaderProps) {
  return (
    <View className="flex-row items-center gap-1.5">
      {DOT_DELAYS.map((delay, index) => (
        <MotiView
          key={`loader-dot-${index}`}
          from={{ translateY: 0, opacity: 0.65 }}
          animate={{ translateY: -bounceHeight, opacity: 1 }}
          transition={{
            type: "timing",
            duration: 360,
            delay,
            loop: true,
            repeatReverse: true,
          }}
          className={`rounded-full ${colorClass}`}
          style={{ width: dotSize, height: dotSize }}
        />
      ))}
    </View>
  );
}
