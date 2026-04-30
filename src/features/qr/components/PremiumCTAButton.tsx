import { AppButton } from "@/src/shared/components";
import { colors } from "@/src/shared/theme";
import * as Haptics from "expo-haptics";
import { SparkleIcon } from "phosphor-react-native";
import React from "react";

type PremiumCTAButtonProps = {
  onPress: () => void;
};

export const PremiumCTAButton = ({ onPress }: PremiumCTAButtonProps) => {
  const handlePress = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <AppButton
      title="Upgrade to Pro"
      onPress={handlePress}
      icon={<SparkleIcon size={20} color={colors.white} weight="thin" />}
      variant="secondary"
    />
  );
};
