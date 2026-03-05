import { colors } from "@/src/shared/theme";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { SmileySadIcon } from "phosphor-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export const NotAvailableScreen = () => {
  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.back();
  };

  return (
    <View className="flex-1 px-6 items-center justify-center bg-white">
      <SmileySadIcon size={256} weight="thin" color={colors.primary} />

      <Text className="mt-6 text-lg leading-7 font-bold text-slate-900 text-center">
        Content not available
      </Text>

      <Text className="mt-2 text-base text-slate-500 text-center max-w-[320px]">
        This content may have been deleted, archived, or is no longer
        accessible.
      </Text>

      <TouchableOpacity
        onPress={handleBack}
        activeOpacity={0.9}
        className="mt-6 px-5 py-3 rounded-xl bg-sky-500"
      >
        <Text className="text-base font-semibold text-white">Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};
