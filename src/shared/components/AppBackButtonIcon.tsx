import { colors } from "@/src/shared/theme";
import { router } from "expo-router";
import { ArrowLeftIcon, CaretLeftIcon, XIcon } from "phosphor-react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import { TouchableIconButton } from "./ui/TouchableIconButton";

type Prop = {
  type?: "xIcon" | "CaretLeftIcon" | "arrowLeftIcon";
};

const AppBackButton = ({ type = "CaretLeftIcon" }: Prop) => {
  const handleBackPress = () => {
    router.back();
  };

  if (type === "arrowLeftIcon") {
    return (
      <TouchableOpacity
        className="p-sm rounded-full bg-slate-100 bg-opacity-10"
        onPress={handleBackPress}
      >
        <ArrowLeftIcon size={16} color={colors.secondary} weight="bold" />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableIconButton
      icon={
        type === "xIcon" ? (
          <XIcon size={20} color={colors.secondary} weight="bold" />
        ) : (
          <CaretLeftIcon size={20} color={colors.secondary} weight="bold" />
        )
      }
      onPress={handleBackPress}
    />
  );
};

export default AppBackButton;
