import {
  UserQRCodePressableCard,
  UserSubscriptionPlanPressableCard,
} from "@/src/features/qr/components";
import {
  IS_QR_FEATURE_MOCK,
  MOCK_QR_PLAN_DATA,
} from "@/src/features/qr/constants";
import { useGetMySubscription } from "@/src/features/qr/hooks";
import { SubscriptionStatus } from "@/src/features/qr/types";
import { AppHeader, HeaderTitle } from "@/src/shared/components";
import { QR_ROUTE } from "@/src/shared/constants";
import { colors } from "@/src/shared/theme/colors";
import { router } from "expo-router";
import {
  GearSixIcon,
  LightbulbIcon,
  MagicWandIcon,
} from "phosphor-react-native";
import React, { useCallback, useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MyQRScreenHeader = () => {
  const handleEditQRProfile = useCallback(() => {
    router.push(QR_ROUTE.customize);
  }, []);

  const handleNavigateSettingScreen = useCallback(() => {
    router.push(QR_ROUTE.profileSetting);
  }, []);

  return (
    <View className="flex-row gap-4 px-2">
      {/* Edit QR Profile */}
      <Pressable onPress={handleEditQRProfile} hitSlop={10}>
        <MagicWandIcon size={22} color={colors.black} weight="bold" />
      </Pressable>
      {/* Edit Profile Setting */}
      <Pressable onPress={handleNavigateSettingScreen} hitSlop={10}>
        <GearSixIcon size={22} color={colors.black} weight="bold" />
      </Pressable>
    </View>
  );
};

const TipCard = () => {
  return (
    <View className="bg-sky-50 rounded-xl border border-sky-100 px-4 py-3 flex-row items-center gap-3 mt-3">
      <View className="bg-primary/10 rounded-full p-2">
        <LightbulbIcon size={18} color={colors.primary} weight="fill" />
      </View>
      <Text className="flex-1 text-xs text-textSecondary leading-5">
        <Text className="text-xs font-semibold text-slate-700">Tip: </Text>
        Stick your QR on items for a higher chance of recovery.
      </Text>
    </View>
  );
};

const MyQRScreen = () => {
  const { data: subscription } = useGetMySubscription();

  const isSubscripted = useMemo(() => {
    if (IS_QR_FEATURE_MOCK) return MOCK_QR_PLAN_DATA.isActive;
    return !!subscription && subscription.status === SubscriptionStatus.Active;
  }, [subscription]);

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <AppHeader
        left={<HeaderTitle title="My Backtrack QR" />}
        right={isSubscripted && <MyQRScreenHeader />}
      />

      <View className="px-4 mt-4">
        {/*  User QRCode */}
        <View className="w-full items-center">
          <UserQRCodePressableCard isSubscripted={isSubscripted} />
          <TipCard />
        </View>

        {/* Subscription Plan Card */}
        {isSubscripted && (
          <View className="mt-6">
            <UserSubscriptionPlanPressableCard />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default MyQRScreen;
