import {
  PremiumCTAButton,
  SubscriptionPlanPressableCard,
  UserSubscriptionPlanDetailCard,
} from "@/src/features/qr/components";
import { SUBSCRIPTION_LINK } from "@/src/features/qr/constants";
import { useGetAllSubscriptionPlans } from "@/src/features/qr/hooks";
import { AppHeader, BackButton, HeaderTitle } from "@/src/shared/components";
import { colors } from "@/src/shared/theme/colors";
import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
    <SafeAreaView className="flex-1 bg-slate-50">
      <AppHeader
        left={<BackButton />}
        center={<HeaderTitle title="Subscription Plans" />}
      />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 48,
          gap: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mt-6">
          <UserSubscriptionPlanDetailCard />
        </View>

        <View className="flex-row items-center justify-between">
          <Text className="text-base font-bold text-slate-900">
            Available Plans
          </Text>
        </View>

        {/* Plan Options */}
        <View className="gap-4">
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
                className="rounded-xl border border-slate-200 px-4 py-2"
              >
                <Text className="text-sm font-semibold text-slate-700">
                  Try again
                </Text>
              </Pressable>
            </View>
          )}

          {!isPlansLoading && !plansError && !subscriptionPlans?.length && (
            <Text className="text-sm text-slate-500">No plans available.</Text>
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

        {/* Upgrade Button */}
        <PremiumCTAButton onPress={handleUpgrade} />
        {/* Disclaimer */}
        <Text className="text-xs text-slate-400 text-center leading-5">
          Cancel anytime in your app store settings.{"\n"}Subscriptions
          automatically renew unless cancelled{"\n"}24 hours before the end of
          the period.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SubscriptionPlanScreen;
