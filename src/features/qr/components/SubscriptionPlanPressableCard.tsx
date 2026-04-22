import { UserSubscriptionPlan } from "@/src/features/qr/types";
import { colors } from "@/src/shared/theme/colors";
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
        selected ? "border-primary bg-accent" : "border-divider bg-surface"
      }`}
    >
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1 gap-0.5">
          <Text
            className={`text-base font-extrabold ${selected ? "text-primary" : "text-textPrimary"}`}
          >
            {plan.name}
          </Text>
        </View>

        <View className="items-end gap-0.5">
          <Text
            className={`text-xl font-extrabold ${selected ? "text-primary" : "text-textPrimary"}`}
          >
            {plan.price}{" "}
            <Text className="text-sm text-textSecondary uppercase">
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
              <SealCheckIcon
                size={16}
                color={selected ? colors.primary : colors.hof[400]}
                weight="thin"
              />
              <Text className="flex-1 text-sm text-textSecondary">{feature}</Text>
            </View>
          ))}
        </View>
      )}
    </Pressable>
  );
}
