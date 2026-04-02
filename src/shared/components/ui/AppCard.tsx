import { cn } from "@/src/shared/utils/cn";
import { colors, metrics } from "@/src/shared/theme";
import React from "react";
import {
  Platform,
  Pressable,
  PressableProps,
  type StyleProp,
  type ViewStyle,
  View,
  ViewProps,
} from "react-native";

type AppCardTone = "default" | "feature";

const baseCardStyle: ViewStyle = {
  backgroundColor: colors.surface,
  borderRadius: metrics.borderRadius.primary,
  ...(Platform.OS === "ios" ? metrics.shadows.level1.ios : {}),
  ...(Platform.OS === "android" ? metrics.shadows.level1.android : {}),
};

const tonePadding: Record<AppCardTone, string> = {
  default: "p-4",
  feature: "p-6",
};

type AppCardProps = ViewProps & {
  tone?: AppCardTone;
};

export const AppCard = ({
  tone = "default",
  className,
  style,
  ...props
}: AppCardProps) => {
  return (
    <View
      {...props}
      className={cn(tonePadding[tone], className)}
      style={[baseCardStyle, style as StyleProp<ViewStyle>]}
    />
  );
};

type AppPressableCardProps = PressableProps & {
  tone?: AppCardTone;
};

export const AppPressableCard = ({
  tone = "default",
  className,
  style,
  ...props
}: AppPressableCardProps) => {
  return (
    <Pressable
      {...props}
      hitSlop={metrics.touchTarget.defaultHitSlop}
      className={cn(tonePadding[tone], "min-h-touch", className)}
      style={({ pressed }) => [
        baseCardStyle,
        {
          transform: [{ scale: pressed ? 0.97 : 1 }],
          opacity: pressed ? 0.95 : 1,
        },
        typeof style === "function" ? style({ pressed }) : style,
      ]}
    />
  );
};
