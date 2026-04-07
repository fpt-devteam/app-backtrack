import { colors } from "@/src/shared/theme";
import { router } from "expo-router";
import { ArrowLeftIcon, CaretLeftIcon, XIcon } from "phosphor-react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import { TouchableIconButton } from "./ui/TouchableIconButton";

type Prop = {
  type?: "xIcon" | "CaretLeftIcon" | "arrowLeftIcon";
  size?: number;
  showBackground?: boolean;
};

export const AppBackButton = ({
  type = "CaretLeftIcon",
  size = 20,
  showBackground = true,
}: Prop) => {
  const handleBackPress = () => {
    router.back();
  };

  if (type === "arrowLeftIcon") {
    return (
      <TouchableOpacity
        className={
          showBackground
            ? "p-sm rounded-full bg-slate-100 bg-opacity-10"
            : "p-sm"
        }
        onPress={handleBackPress}
      >
        <ArrowLeftIcon size={size} color={colors.secondary} weight="bold" />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableIconButton
      icon={
        type === "xIcon" ? (
          <XIcon size={size} color={colors.secondary} weight="bold" />
        ) : (
          <CaretLeftIcon size={size} color={colors.secondary} weight="bold" />
        )
      }
      onPress={handleBackPress}
    />
  );
};
