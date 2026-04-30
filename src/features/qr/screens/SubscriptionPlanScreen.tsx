import {
  PremiumCTAButton,
  SubscriptionPlanPressableCard,
  UserSubscriptionPlanDetailCard,
} from "@/src/features/qr/components";
import { SUBSCRIPTION_LINK } from "@/src/features/qr/constants";
import { useGetAllSubscriptionPlans } from "@/src/features/qr/hooks";
import { colors } from "@/src/shared/theme/colors";
import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  Text,
  View,
} from "react-native";

const SubscriptionPlanScreen = () => {
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const {
    data: subscriptionPlans,
    isLoading: isPlansLoading,
    error: plansError,
    refetch: refetchPlans,
  } = useGetAllSubscriptionPlans();

  useEffect(() => {
    if (!subscriptionPlans?.length) return;

    const selectedPlanExists = subscriptionPlans.some(
      (plan) => plan.id === selectedPlanId,
    );

    if (!selectedPlanExists) {
      setSelectedPlanId(subscriptionPlans[0].id);
    }
  }, [subscriptionPlans, selectedPlanId]);

  const handleUpgrade = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(SUBSCRIPTION_LINK);
  }, []);

  return (
    <View className="flex-1 bg-surface p-md gap-xl">
      <UserSubscriptionPlanDetailCard />

      {/* Plan Options */}
      <View className="gap-md">
        <Text className="text-base font-normal text-textPrimary">
          Available Plans
        </Text>

        {isPlansLoading && (
          <View className="items-center py-6">
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        )}

        {!!plansError && !isPlansLoading && (
          <View className="items-center gap-3 py-2">
            <Text className="text-sm text-red-500 text-center">
              Failed to fetch available plans.
            </Text>
            <Pressable
              onPress={() => refetchPlans()}
              className="rounded-xl border border-divider px-4 py-2"
            >
              <Text className="text-sm font-semibold text-slate-700">
                Try again
              </Text>
            </Pressable>
          </View>
        )}

        {!isPlansLoading && !plansError && !subscriptionPlans?.length && (
          <Text className="text-sm text-textSecondary">
            No plans available.
          </Text>
        )}

        {!isPlansLoading &&
          !plansError &&
          subscriptionPlans?.map((plan) => (
            <SubscriptionPlanPressableCard
              key={plan.id}
              plan={plan}
              selected={selectedPlanId === plan.id}
              onSelect={setSelectedPlanId}
            />
          ))}
      </View>

      <View className="gap-sm">
        <PremiumCTAButton onPress={handleUpgrade} />

        <Text className="text-xs text-textSecondary font-thin text-center leading-5">
          Subscriptions automatically renew unless cancelled{"\n"}24 hours
          before the end of the period.
        </Text>
      </View>
    </View>
  );
};

export default SubscriptionPlanScreen;
