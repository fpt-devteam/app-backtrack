import * as Haptics from "expo-haptics";
import { SparkleIcon } from "phosphor-react-native";
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { colors } from "@/src/shared/theme";

type PremiumCTAButtonProps = {
  onPress: () => void;
};

export const PremiumCTAButton = ({ onPress }: PremiumCTAButtonProps) => {
  const handlePress = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      className="w-full py-5 rounded-sm bg-primary items-center justify-center flex-row gap-sm"
    >
      <SparkleIcon size={18} color={colors.white} weight="thin" />
      <Text className="text-base font-normal text-white">Upgrade to Pro</Text>
    </TouchableOpacity>
  );
};
