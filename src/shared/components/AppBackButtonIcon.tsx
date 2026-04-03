import { colors } from "@/src/shared/theme";
import { router } from "expo-router";
import { CaretLeftIcon } from "phosphor-react-native";
import React from "react";
import { TouchableIconButton } from "./ui/TouchableIconButton";

const AppBackButton = () => {
  const handleBackPress = () => {
    router.back();
  };

  return (
    <TouchableIconButton
      icon={<CaretLeftIcon size={28} color={colors.secondary} weight="bold" />}
      onPress={handleBackPress}
    />
  );
};

export default AppBackButton;
