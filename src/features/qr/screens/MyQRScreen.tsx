import {
  UserQRCodeCard,
  UserSubscriptionPlanCard,
} from "@/src/features/qr/components";
import { useGetMySubscription } from "@/src/features/qr/hooks";
import { SubscriptionStatus } from "@/src/features/qr/types";
import { AppHeader, HeaderTitle } from "@/src/shared/components";
import { QR_ROUTE, SHARED_ROUTE } from "@/src/shared/constants";
import { colors } from "@/src/shared/theme/colors";
import type { ExternalPathString, RelativePathString } from "expo-router";
import { router } from "expo-router";
import {
  GearSixIcon,
  LightbulbIcon,
  PencilSimpleIcon,
} from "phosphor-react-native";
import React, { useCallback } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MyQRScreenHeader = () => {
  const handleEditQRProfile = useCallback(() => {
    router.push(
      SHARED_ROUTE.notAvailable as ExternalPathString | RelativePathString,
    );
  }, []);

  const handleNavigateSettingScreen = useCallback(() => {
    router.push(
      QR_ROUTE.profileSetting as ExternalPathString | RelativePathString,
    );
  }, []);

  return (
    <View className="flex-row gap-4 px-2">
      {/* Edit QR Profile */}
      <Pressable onPress={handleEditQRProfile} hitSlop={10}>
        <PencilSimpleIcon size={22} color={colors.black} weight="bold" />
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
      <Text className="flex-1 text-xs text-slate-600 leading-5">
        <Text className="text-xs font-semibold text-slate-700">Tip: </Text>
        Stick your QR on items for a higher chance of recovery.
      </Text>
    </View>
  );
};

const MyQRScreen = () => {
  const { data: subscription } = useGetMySubscription();

  const isSubscribed =
    !!subscription && subscription.status === SubscriptionStatus.Active;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <AppHeader
        left={<HeaderTitle title="My Backtrack QR" />}
        right={<MyQRScreenHeader />}
      />

      <View className="px-4 mt-4">
        {/*  User QRCode*/}
        <View className="w-full items-center">
          <UserQRCodeCard isSubscripted={isSubscribed} />
          <TipCard />
        </View>

        {/* Subscription Plan Card */}
        <View className="mt-6">
          <UserSubscriptionPlanCard />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MyQRScreen;
