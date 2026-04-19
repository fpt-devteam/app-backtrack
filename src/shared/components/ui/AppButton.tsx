import { AppLoader } from "@/src/shared/components/AppLoader";
import { cn } from "@/src/shared/utils/cn";
import { View } from "moti";
import React from "react";
import { Text, TouchableOpacity } from "react-native";

type AppButtonVariant = "primary" | "secondary" | "outline";

type AppButtonProps = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: AppButtonVariant;
  className?: string;
  icon?: React.ReactNode;
};

const BUTTON_VARIANT_CLASS: Record<AppButtonVariant, string> = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  outline: "bg-surface border border-secondary",
};

export const AppButton = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",
  className,
  icon,
}: AppButtonProps) => {
  const isDisabled = disabled || loading;
  const isOutline = variant === "outline";
  const textColor = isOutline ? "text-secondary" : "text-white";
  const loaderColor = isOutline ? "bg-secondary" : "bg-white";

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
        <AppLoader colorClass={loaderColor} />
      ) : (
        <View className="flex-row items-center justify-center gap-2">
          {icon && <View className="">{icon}</View>}
          <Text className={`text-base font-normal ${textColor} tracking-label`}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};
