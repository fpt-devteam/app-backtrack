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
  CheckCircleIcon,
  LockKeyIcon,
  ProhibitIcon,
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
    </View>
  );
}

export const UserSubscriptionPlanDetailCard = () => {
  const { data: subscription, isLoading } = useGetMySubscription();

  const handleCancel = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(SUBSCRIPTION_LINK);
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
      <View className="gap-2">
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
      </View>

      {/* Cancel Button */}
      {isActiveDisplay && (
        <Pressable
          onPress={handleCancel}
          className="flex-row items-center justify-center gap-2 mt-3 py-3 rounded-xl border border-red-100 bg-red-50 active:opacity-70"
        >
          <ProhibitIcon size={16} color={colors.status.error} weight="fill" />
          <Text className="text-sm font-medium text-red-600">
            Cancel Subscription
          </Text>
        </Pressable>
      )}
    </View>
  );
};
