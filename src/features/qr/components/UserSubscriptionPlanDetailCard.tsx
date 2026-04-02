import {
  IS_QR_FEATURE_MOCK,
  MOCK_QR_PLAN_DATA,
  SUBSCRIPTION_LINK,
} from "@/src/features/qr/constants";
import { useGetMySubscription } from "@/src/features/qr/hooks";
import { SubscriptionStatus, UserSubscription } from "@/src/features/qr/types";
import { colors } from "@/src/shared/theme/colors";
import { formatDate } from "@/src/shared/utils";
import {
  ArrowSquareOutIcon,
  CalendarBlankIcon,
  LockKeyIcon,
  StarIcon,
  WarningIcon,
} from "phosphor-react-native";
import React, { useCallback, useMemo } from "react";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  Text,
  View,
} from "react-native";

import * as Haptics from "expo-haptics";

type CardBodyProps = {
  readonly isLoading: boolean;
  readonly isActive: boolean;
  readonly subscription: UserSubscription | null | undefined;
  readonly onManageSubscription: () => void;
};

function CardBody({
  isLoading,
  isActive,
  subscription,
  onManageSubscription,
}: CardBodyProps) {
  if (isLoading) {
    return (
      <View className="rounded-3xl border border-[#1f335f] bg-[#0d1f45] px-6 py-8 items-center justify-center">
        <ActivityIndicator size="small" color="#e5edff" />
      </View>
    );
  }

  if (isActive && subscription) {
    return (
      <View className="overflow-hidden rounded-3xl border border-[#1f335f] bg-[#0d1f45] px-6 py-6">
        <View className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#2f4872] opacity-35" />
        <View className="absolute left-16 top-0 h-40 w-40 rounded-full bg-[#16346a] opacity-35" />

        <View className="flex-row items-start justify-between">
          <View className="flex-1 pr-4">
            <Text className="text-sm font-semibold text-slate-300 uppercase">
              Current Plan
            </Text>
            <View className="mt-2 flex-row items-center gap-2">
              <Text className="text-lg font-extrabold text-white leading-tight">
                {subscription.planType}
              </Text>
              <View className="rounded-full bg-[#0c8b58]/30 px-3 py-1 border border-[#0fbf79]/35">
                <Text className="text-[#20d489] text-xs font-semibold">
                  Active
                </Text>
              </View>
            </View>
          </View>

          <View className="h-16 w-16 rounded-full bg-[#30476f]/75 items-center justify-center">
            <StarIcon size={28} color="#facc15" weight="fill" />
          </View>
        </View>

        <View className="flex-row items-center gap-3">
          <CalendarBlankIcon size={22} color="#d9e4ff" weight="regular" />
          <Text className="text-sm text-slate-200 font-medium">
            Renews on {formatDate(subscription.currentPeriodEnd)}
          </Text>
        </View>

        <Pressable
          onPress={onManageSubscription}
          className="mt-4 h-12 rounded-full bg-surface flex-row items-center justify-center gap-2 active:opacity-85"
        >
          <Text className="text-textPrimary font-semibold text-base">
            Manage Subscription
          </Text>
          <ArrowSquareOutIcon size={20} color="#0f172a" weight="bold" />
        </Pressable>

        {subscription.cancelAtPeriodEnd && (
          <View className="mt-3 flex-row items-center gap-1">
            <WarningIcon size={14} color={colors.amber[500]} weight="fill" />
            <Text className="text-xs text-amber-300 font-medium">
              Subscription will cancel at the end of this billing period
            </Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <View className="rounded-3xl border border-divider bg-surface px-5 py-5">
      <View className="flex-row items-center gap-3">
        <View className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center">
          <LockKeyIcon size={18} color={colors.slate[500]} weight="fill" />
        </View>
        <View className="flex-1">
          <Text className="text-sm font-semibold text-textPrimary">
            No active subscription
          </Text>
          <Text className="text-xs text-textSecondary mt-0.5">
            Subscribe to unlock your QR features
          </Text>
        </View>
      </View>

      <Pressable
        onPress={onManageSubscription}
        className="mt-4 h-11 rounded-full border border-divider bg-canvas flex-row items-center justify-center gap-2 active:opacity-80"
      >
        <Text className="text-slate-700 font-medium text-sm">View Plans</Text>
        <ArrowSquareOutIcon size={18} color={colors.slate[700]} weight="bold" />
      </Pressable>
    </View>
  );
}

export const UserSubscriptionPlanDetailCard = () => {
  const { data: subscription, isLoading } = useGetMySubscription();

  const handleManageSubscription = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await Linking.openURL(SUBSCRIPTION_LINK);
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
    <CardBody
      isLoading={isLoading}
      isActive={isActiveDisplay}
      subscription={subscriptionData}
      onManageSubscription={handleManageSubscription}
    />
  );
};
