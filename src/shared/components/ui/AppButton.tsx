import { cn } from "@/src/shared/utils/cn";
import { colors, metrics, typography } from "@/src/shared/theme";
import React from "react";
import {
  Pressable,
  PressableProps,
  Text,
  type TextStyle,
  type ViewStyle,
} from "react-native";

type AppButtonVariant = "primary" | "secondary" | "ghost";
type AppButtonShape = "pill" | "rounded";

const variantStyleMap: Record<AppButtonVariant, ViewStyle> = {
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.surface,
  },
  ghost: {
    backgroundColor: "transparent",
  },
};

const variantTextMap: Record<AppButtonVariant, TextStyle> = {
  primary: {
    color: colors.primaryForeground,
  },
  secondary: {
    color: colors.text.primary,
  },
  ghost: {
    color: colors.primary,
  },
};

const shapeMap: Record<AppButtonShape, ViewStyle> = {
  pill: { borderRadius: metrics.borderRadius.full },
  rounded: { borderRadius: metrics.borderRadius.lg },
};

type AppButtonProps = PressableProps & {
  label: string;
  variant?: AppButtonVariant;
  shape?: AppButtonShape;
};

export const AppButton = ({
  label,
  variant = "primary",
  shape = "pill",
  className,
  style,
  ...props
}: AppButtonProps) => {
  return (
    <Pressable
      {...props}
      hitSlop={metrics.touchTarget.defaultHitSlop}
      className={cn("min-h-touch items-center justify-center px-4", className)}
      style={({ pressed }) => [
        variantStyleMap[variant],
        shapeMap[shape],
        {
          transform: [{ scale: pressed ? 0.97 : 1 }],
          opacity: pressed ? 0.92 : 1,
        },
        typeof style === "function" ? style({ pressed }) : style,
      ]}
    >
      <Text
        style={[
          variantTextMap[variant],
          {
            fontSize: typography.fontSize.base,
            lineHeight: 24,
            fontWeight: "600",
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
};
