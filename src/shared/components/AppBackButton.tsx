import { colors } from "@/src/shared/theme";
import { router } from "expo-router";
import { ArrowLeftIcon, CaretLeftIcon, XIcon } from "phosphor-react-native";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { TouchableIconButton } from "./ui/TouchableIconButton";

type Prop = {
  type?: "xIcon" | "CaretLeftIcon" | "arrowLeftIcon";
  size?: number;
  showBackground?: boolean;
  onPress?: () => void;
  disabled?: boolean;
};

export const AppBackButton = ({
  type = "CaretLeftIcon",
  size = 20,
  showBackground = true,
  onPress,
  disabled = false,
}: Prop) => {
  const handleBackPress = () => {
    if (onPress) {
      onPress();
    } else {
      router.back();
    }
  };

  const disabledStyle = disabled ? "opacity-40" : "opacity-100";

  if (type === "arrowLeftIcon") {
    return (
      <TouchableOpacity
        className={`${
          showBackground
            ? "p-sm rounded-full bg-slate-100 bg-opacity-10"
            : "p-sm"
        } ${disabledStyle}`}
        onPress={handleBackPress}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <ArrowLeftIcon size={size} color={colors.secondary} weight="bold" />
      </TouchableOpacity>
    );
  }

  return (
    <View className={disabledStyle}>
      <TouchableIconButton
        icon={
          type === "xIcon" ? (
            <XIcon size={size} color={colors.secondary} weight="bold" />
          ) : (
            <CaretLeftIcon size={size} color={colors.secondary} weight="bold" />
          )
        }
        onPress={handleBackPress}
        disabled={disabled}
      />
    </View>
  );
};
