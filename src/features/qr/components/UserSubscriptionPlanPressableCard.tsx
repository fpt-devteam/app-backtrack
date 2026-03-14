import {
  IS_QR_FEATURE_MOCK,
  MOCK_QR_PLAN_DATA,
} from "@/src/features/qr/constants";
import { useGetMySubscription } from "@/src/features/qr/hooks";
import { SubscriptionStatus, UserSubscription } from "@/src/features/qr/types";
import { QR_ROUTE } from "@/src/shared/constants";
import { colors } from "@/src/shared/theme/colors";
import { formatDate } from "@/src/shared/utils";
import { router } from "expo-router";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  LockKeyIcon,
  WarningIcon,
} from "phosphor-react-native";
import React, { useCallback, useMemo } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

type CardBodyProps = {
  readonly isLoading: boolean;
  readonly isActive: boolean;
  readonly subscription: UserSubscription | null | undefined;
};

function CardBody({ isLoading, isActive, subscription }: CardBodyProps) {
  if (isLoading) {
    return <ActivityIndicator size="small" color={colors.primary} />;
  }

  if (isActive && subscription) {
    return (
      <View className="gap-1">
        <View className="flex-row items-center gap-2">
          <Text className="text-base font-bold text-primary">
            {subscription.planType} Subscription
          </Text>
          <CheckCircleIcon
            size={18}
            color={colors.status.success}
            weight="fill"
          />
          {subscription.cancelAtPeriodEnd && (
            <View className="flex-row items-center gap-1 ml-1">
              <WarningIcon size={14} color={colors.amber[500]} weight="fill" />
              <Text className="text-xs text-amber-500 font-medium">
                Cancels soon
              </Text>
            </View>
          )}
        </View>
        <Text className="text-sm text-slate-400">
          Renews on {formatDate(subscription.currentPeriodEnd)}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-row items-center gap-3">
      <View className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center">
        <LockKeyIcon size={16} color={colors.slate[500]} weight="fill" />
      </View>
      <View className="flex-1">
        <Text className="text-sm font-semibold text-slate-700">
          No active subscription
        </Text>
        <Text className="text-xs text-slate-400 mt-0.5">
          Subscribe to unlock your QR
        </Text>
      </View>
      <ArrowRightIcon size={16} color={colors.slate[400]} weight="bold" />
    </View>
  );
}

export const UserSubscriptionPlanPressableCard = () => {
  const { data: subscription, isLoading } = useGetMySubscription();

  const handleNavigatePlanScreen = useCallback(() => {
    router.push(QR_ROUTE.purchase);
  }, []);

  const isActiveDisplay = useMemo(() => {
    if (IS_QR_FEATURE_MOCK) return MOCK_QR_PLAN_DATA.isActive;
    return !!subscription && subscription.status === SubscriptionStatus.Active;
  }, [subscription]);

  const subscriptionData = useMemo(() => {
    if (IS_QR_FEATURE_MOCK) return MOCK_QR_PLAN_DATA.subscription;
    return subscription;
  }, [subscription]);

  return (
    <View>
      <Pressable onPress={handleNavigatePlanScreen} className="gap-2">
        <View className="flex-row items-center justify-between px-1">
          <Text className="text-base font-bold text-slate-900">
            Current Plan
          </Text>
        </View>

        <View className="bg-white rounded-2xl border border-slate-100 px-5 py-4">
          <CardBody
            isLoading={isLoading}
            isActive={isActiveDisplay}
            subscription={subscriptionData}
          />
        </View>
      </Pressable>
    </View>
  );
};
