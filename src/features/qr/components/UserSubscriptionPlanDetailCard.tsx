import {
  IS_QR_FEATURE_MOCK,
  MOCK_QR_PLAN_DATA,
  SUBSCRIPTION_LINK,
} from "@/src/features/qr/constants";
import { useGetMySubscription } from "@/src/features/qr/hooks";
import { SubscriptionStatus, UserSubscription } from "@/src/features/qr/types";
import { colors } from "@/src/shared/theme/colors";
import { formatDate } from "@/src/shared/utils";
import * as Haptics from "expo-haptics";
import {
  ArrowSquareOutIcon,
  CalendarBlankIcon,
  LockKeyIcon,
  StarIcon,
  WarningIcon,
} from "phosphor-react-native";
import React, { useCallback, useMemo } from "react";
import type { ViewStyle } from "react-native";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  Text,
  View,
} from "react-native";

const CARD_SHADOW: ViewStyle = {
  shadowColor: colors.black,
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.2,
  shadowRadius: 8,
  elevation: 4,
};

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
      <View
        className="rounded-xl border border-divider bg-surface px-6 py-8 items-center justify-center"
        style={CARD_SHADOW}
      >
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }

  if (isActive && subscription) {
    return (
      <View
        className="rounded-xl border border-divider bg-surface p-md gap-md"
        style={CARD_SHADOW}
      >
        <View className="gap-xs">
          {/* Title */}
          <View className="flex-row items-start justify-between">
            <View className="flex-row items-center gap-xs">
              <Text className="text-lg font-normal text-textPrimary">
                Current Plan
              </Text>

              {/* Badges */}
              <View className="flex-row items-center gap-xs">
                <View className="rounded-full bg-[#E6F4EA] px-sm py-xs">
                  <Text className="text-[#008A05] text-xs font-semibold">
                    {subscription.planType}
                  </Text>
                </View>

                <View className="rounded-full bg-[#E6F4EA] px-sm py-xs">
                  <Text className="text-[#008A05] text-xs font-semibold">
                    Active
                  </Text>
                </View>
              </View>
            </View>

            <StarIcon size={24} color={colors.primary} weight="thin" />
          </View>

          {/* Renewal Date */}
          <View className="flex-row items-center gap-xs">
            <CalendarBlankIcon
              size={18}
              color={colors.hof[500]}
              weight="thin"
            />
            <Text className="text-sm text-textSecondary font-thin">
              Renews on {formatDate(subscription.currentPeriodEnd)}
            </Text>
          </View>
        </View>

        {/* Manage Subscription */}
        <Pressable
          onPress={onManageSubscription}
          className="py-sm rounded-full border border-divider bg-canvas flex-row items-center justify-center gap-xs active:opacity-80"
        >
          <Text className="text-textPrimary font-normal text-sm">
            Manage Subscription
          </Text>
          <ArrowSquareOutIcon size={16} color={colors.hof[900]} />
        </Pressable>

        {/* Cancellation Notice */}
        {subscription.cancelAtPeriodEnd && (
          <View className="mt-3 flex-row items-center gap-1">
            <WarningIcon
              size={14}
              color={colors.status.warning}
              weight="thin"
            />
            <Text
              className="text-xs font-medium"
              style={{ color: colors.status.warning }}
            >
              Subscription will cancel at the end of this billing period
            </Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <View
      className="rounded-xl border border-divider bg-surface px-5 py-5"
      style={CARD_SHADOW}
    >
      <View className="flex-row items-center gap-3">
        <View className="w-10 h-10 rounded-full bg-canvas items-center justify-center">
          <LockKeyIcon size={18} color={colors.hof[500]} weight="thin" />
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
        className="mt-4 py-sm rounded-full border border-divider bg-canvas flex-row items-center justify-center gap-xs active:opacity-80"
      >
        <Text className="text-textPrimary font-medium text-sm">View Plans</Text>
        <ArrowSquareOutIcon size={16} color={colors.hof[900]} weight="thin" />
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
