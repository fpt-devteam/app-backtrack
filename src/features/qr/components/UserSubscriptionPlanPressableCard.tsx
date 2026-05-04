import { useAppUser } from "@/src/features/auth/providers";
import { useGetMySubscription } from "@/src/features/qr/hooks";
import { SubscriptionStatus, UserSubscription } from "@/src/features/qr/types";
import { QR_ROUTE } from "@/src/shared/constants";
import { colors } from "@/src/shared/theme/colors";
import { formatDate } from "@/src/shared/utils";
import { router } from "expo-router";
import {
  ArrowRightIcon,
  CalendarBlankIcon,
  SparkleIcon,
  StarIcon,
  WarningIcon,
} from "phosphor-react-native";
import React, { useCallback, useMemo } from "react";
import type { ViewStyle } from "react-native";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

const CARD_SHADOW: ViewStyle = {
  shadowColor: colors.black,
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.2,
  shadowRadius: 8,
  elevation: 4,
};

type ActiveBodyProps = {
  readonly subscription: UserSubscription;
};

function ActiveBody({ subscription }: ActiveBodyProps) {
  return (
    <View className="gap-xs">
      {/* Plan heading row */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-xs">
          <StarIcon size={16} color={colors.primary} weight="fill" />
          <Text className="text-base font-semibold text-primary">
            {subscription.planType} Plan
          </Text>
        </View>

        <View
          className="rounded-full px-2 py-0.5"
          style={{ backgroundColor: colors.babu[100] }}
        >
          <Text
            className="text-xs font-normal"
            style={{ color: colors.status.success }}
          >
            Active
          </Text>
        </View>
      </View>

      {/* Renewal row */}
      <View className="flex-row items-center gap-xs flex-wrap">
        <CalendarBlankIcon size={13} color={colors.hof[400]} weight="thin" />
        <Text className="text-sm text-textSecondary font-thin">
          Renews {formatDate(subscription.currentPeriodEnd)}
        </Text>

        {subscription.cancelAtPeriodEnd && (
          <View className="flex-row items-center gap-1 ml-auto">
            <WarningIcon
              size={13}
              color={colors.status.warning}
              weight="fill"
            />
            <Text className="text-xs" style={{ color: colors.status.warning }}>
              Cancels soon
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

function UpsellBody() {
  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-1 gap-0.5">
        <View className="flex-row items-center gap-xs">
          <SparkleIcon size={15} color={colors.primary} weight="fill" />
          <Text className="text-sm font-semibold text-primary">
            Unlock Premium QR
          </Text>
        </View>
        <Text className="text-xs font-thin text-textSecondary">
          Custom logo · Full contact visibility
        </Text>
      </View>

      <View
        className="flex-row items-center gap-1 rounded-full px-3 py-1.5"
        style={{ backgroundColor: colors.primary }}
      >
        <Text className="text-xs font-semibold text-white">Upgrade</Text>
        <ArrowRightIcon size={11} color={colors.white} weight="bold" />
      </View>
    </View>
  );
}

export const UserSubscriptionPlanPressableCard = () => {
  const { user, refetch } = useAppUser();
  const { data: subscription, isLoading } = useGetMySubscription();

  const handleNavigatePlanScreen = useCallback(() => {
    router.push(QR_ROUTE.purchase);
  }, []);

  const isActiveDisplay = useMemo(() => {
    return !!subscription && subscription.status === SubscriptionStatus.Active;
  }, [subscription]);

  const subscriptionData = useMemo(() => {
    return subscription;
  }, [subscription]);

  return (
    <View className="gap-2">
      <Pressable onPress={handleNavigatePlanScreen}>
        {isLoading ? (
          // Loading skeleton — matches active card proportions
          <View
            className="bg-surface rounded-xl border border-divider px-5 py-5 items-center"
            style={CARD_SHADOW}
          >
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        ) : isActiveDisplay && subscriptionData ? (
          // Active subscription — elevated white card matching FeatureCard
          <View
            className="bg-surface rounded-xl border border-divider px-5 py-4"
            style={CARD_SHADOW}
          >
            <ActiveBody subscription={subscriptionData} />
          </View>
        ) : (
          // Upsell banner — primary-tinted background, upgrade CTA
          <View
            className="rounded-xl px-5 py-4"
            style={{ backgroundColor: colors.rausch[50] }}
          >
            <UpsellBody />
          </View>
        )}
      </Pressable>
    </View>
  );
};
