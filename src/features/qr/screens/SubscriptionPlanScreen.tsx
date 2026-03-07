import { UserSubscriptionPlanCard } from "@/src/features/qr/components";
import { MOCK_USER_SUBSCRIPTION_PLANS } from "@/src/features/qr/constants";
import { useSubscription } from "@/src/features/qr/hooks";
import { UserSubscriptionPlan } from "@/src/features/qr/types";
import { AppHeader, BackButton, HeaderTitle } from "@/src/shared/components";
import { colors } from "@/src/shared/theme/colors";
import { router } from "expo-router";
import { RocketLaunchIcon, ShieldCheckIcon } from "phosphor-react-native";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type PlanOptionCardProps = {
  readonly plan: UserSubscriptionPlan;
  readonly selected: boolean;
  readonly onSelect: (id: string) => void;
};

function PlanOptionCard({ plan, selected, onSelect }: PlanOptionCardProps) {
  return (
    <Pressable
      onPress={() => onSelect(plan.id)}
      className={`relative flex-row items-center justify-between rounded-2xl border px-5 py-4 ${
        selected ? "border-primary bg-sky-50" : "border-slate-200 bg-white"
      }`}
    >
      <View className="gap-0.5">
        <Text
          className={`text-sm font-bold ${selected ? "text-primary" : "text-slate-800"}`}
        >
          {plan.label}
        </Text>
        <Text className="text-xs text-slate-400">{plan.description}</Text>
      </View>

      <View className="flex-row items-baseline gap-0.5">
        <Text
          className={`text-lg font-extrabold ${selected ? "text-primary" : "text-slate-800"}`}
        >
          {plan.price}
        </Text>
        <Text className="text-xs text-slate-400">{plan.unit}</Text>
      </View>

      {!!plan.badge && (
        <View className="absolute -top-3 right-4 bg-primary rounded-full px-2.5 py-0.5">
          <Text className="text-white text-[10px] font-bold tracking-wide">
            {plan.badge}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const SubscriptionPlanScreen = () => {
  const [selectedPlanId, setSelectedPlanId] = useState("yearly");
  const { subscribe, isSubscribing, error, isSuccess, reset } =
    useSubscription();

  const selectedPlan =
    MOCK_USER_SUBSCRIPTION_PLANS.find((p) => p.id === selectedPlanId) ??
    MOCK_USER_SUBSCRIPTION_PLANS[2];

  const handleUpgrade = useCallback(async () => {
    reset();
    try {
      await subscribe({ priceId: selectedPlan.priceId });
      router.back();
    } catch {
      // error surfaced via `error` state
    }
  }, [subscribe, selectedPlan, reset]);

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <AppHeader
        left={<BackButton />}
        center={<HeaderTitle title="My Subscription Plan" />}
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
          <UserSubscriptionPlanCard showCancelButton={true} />
        </View>

        {/* Plan Selection Header */}
        <View className="flex-row items-center justify-between">
          <Text className="text-base font-bold text-slate-900">
            Select a Plan
          </Text>
          <View className="flex-row items-center gap-1.5 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1">
            <ShieldCheckIcon
              size={13}
              color={colors.status.success}
              weight="fill"
            />
            <Text className="text-xs font-semibold text-emerald-700">
              Secure Payment
            </Text>
          </View>
        </View>

        {/* Plan Options */}
        <View className="gap-4">
          {MOCK_USER_SUBSCRIPTION_PLANS.map((plan) => (
            <PlanOptionCard
              key={plan.id}
              plan={plan}
              selected={selectedPlanId === plan.id}
              onSelect={setSelectedPlanId}
            />
          ))}
        </View>

        {/* Upgrade Button */}
        <View className="px-6 pb-6 pt-4">
          {error && (
            <Text className="text-xs text-red-500 text-center mb-3">
              {error}
            </Text>
          )}
          {isSuccess && (
            <Text className="text-xs text-emerald-600 text-center mb-3">
              Subscription activated!
            </Text>
          )}
          <Pressable
            onPress={handleUpgrade}
            disabled={isSubscribing}
            className="bg-primary rounded-2xl py-4 items-center flex-row justify-center gap-2"
            style={{ opacity: isSubscribing ? 0.7 : 1 }}
          >
            {isSubscribing ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Text className="text-white font-bold text-base">
                  Upgrade to Premium
                </Text>
                <RocketLaunchIcon size={18} color="white" weight="fill" />
              </>
            )}
          </Pressable>
        </View>

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