import { colors } from "@/src/shared/theme/colors";
import * as Haptics from "expo-haptics";
import React from "react";
import { Switch, Text, View } from "react-native";

type UserSettingToggleRowProps = {
  label: string;
  subtitle?: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
};

export const UserSettingToggleRow = ({
  label,
  subtitle,
  value,
  onValueChange,
}: UserSettingToggleRowProps) => {
  const handleOnSwitch = (value: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onValueChange(value);
  };

  return (
    <View className="flex-row items-center justify-between py-3">
      <View className="flex-1 pr-4">
        <Text className="text-sm font-medium text-textPrimary">{label}</Text>
        {!!subtitle && (
          <Text className="text-xs text-slate-400 mt-0.5">{subtitle}</Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={handleOnSwitch}
        trackColor={{ false: colors.slate[200], true: colors.primary }}
        thumbColor={colors.white}
      />
    </View>
  );
};
