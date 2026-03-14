import { UserSubscriptionPlan } from "@/src/features/qr/types";
import * as Haptics from "expo-haptics";
import { SealCheckIcon } from "phosphor-react-native";
import React, { useCallback } from "react";
import { Pressable, Text, View } from "react-native";

type SubscriptionPlanPressableCardProps = {
  readonly plan: UserSubscriptionPlan;
  readonly selected: boolean;
  readonly onSelect: (id: string) => void;
};

export function SubscriptionPlanPressableCard({
  plan,
  selected,
  onSelect,
}: SubscriptionPlanPressableCardProps) {
  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect(plan.id);
  }, [onSelect, plan.id]);

  return (
    <Pressable
      onPress={handlePress}
      className={`relative rounded-2xl border px-5 py-4 ${
        selected ? "border-primary bg-sky-50" : "border-slate-200 bg-white"
      }`}
    >
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1 gap-0.5">
          <Text
            className={`text-base font-extrabold ${selected ? "text-primary" : "text-slate-900"}`}
          >
            {plan.name}
          </Text>
        </View>

        <View className="items-end gap-0.5">
          <Text
            className={`text-xl font-extrabold ${selected ? "text-primary" : "text-slate-900"}`}
          >
            {plan.price}{" "}
            <Text className="text-sm text-slate-500 uppercase">
              {plan.currency}
            </Text>
          </Text>
        </View>
      </View>

      {!!plan.features?.length && (
        <View className="mt-4 gap-2">
          {plan.features.map((feature, index) => (
            <View
              key={`${plan.id}-feature-${index}`}
              className="flex-row items-center gap-2"
            >
              <SealCheckIcon size={16} />
              <Text className="flex-1 text-sm text-slate-600">{feature}</Text>
            </View>
          ))}
        </View>
      )}
    </Pressable>
  );
}
