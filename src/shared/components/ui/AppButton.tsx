import { cn } from "@/src/shared/utils/cn";
import { MotiView } from "moti";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type AppButtonVariant = "primary" | "secondary";

type AppButtonProps = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: AppButtonVariant;
  className?: string;
};

const BUTTON_VARIANT_CLASS: Record<AppButtonVariant, string> = {
  primary: "bg-primary",
  secondary: "bg-secondary",
};

const DOT_DELAYS = [0, 150, 300];

export const AppButton = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",
  className,
}: AppButtonProps) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      className={cn(
        "w-full h-control-lg rounded-sm items-center justify-center",
        BUTTON_VARIANT_CLASS[variant],
        isDisabled && "opacity-50",
        className,
      )}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.88}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
    >
      {loading ? (
        <View className="flex-row items-center gap-1.5">
          {DOT_DELAYS.map((delay, index) => (
            <MotiView
              key={`loading-dot-${index}`}
              from={{ translateY: 0, opacity: 0.65 }}
              animate={{ translateY: -6, opacity: 1 }}
              transition={{
                type: "timing",
                duration: 360,
                delay,
                loop: true,
                repeatReverse: true,
              }}
              className="h-1.5 w-1.5 rounded-full bg-white"
            />
          ))}
        </View>
      ) : (
        <Text className="text-base font-semibold text-white tracking-label">
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};
