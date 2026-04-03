import { useAuth } from "@/src/features/auth/providers";
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
import { AUTH_ROUTE, QR_ROUTE } from "@/src/shared/constants";
import { colors } from "@/src/shared/theme/colors";
import { router } from "expo-router";
import {
  GearSixIcon,
  LightbulbIcon,
  MagicWandIcon,
  QrCodeIcon,
} from "phosphor-react-native";
import React, { useCallback, useMemo } from "react";
import {
  Pressable,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

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
  const { width, height } = useWindowDimensions();
  const { isAppReady, isLoggedIn } = useAuth();
  const isAuthReady = isAppReady && isLoggedIn;

  const isSubscripted = useMemo(() => {
    if (IS_QR_FEATURE_MOCK) return MOCK_QR_PLAN_DATA.isActive;
    return !!subscription && subscription.status === SubscriptionStatus.Active;
  }, [subscription]);

  const renderBody = () => {
    if (!isAuthReady) {
      return (
        <View
          className="flex-1 bg-surface px-10 gap-10"
          style={{
            paddingTop: height * 0.15,
            paddingBottom: height * 0.1,
          }}
        >
          <View className="flex-row justify-center">
            <QrCodeIcon size={128} color={colors.primary} />
          </View>

          <View className="gap-y-2">
            <Text className="text-xl font-normal text-textPrimary text-center">
              Log in to see your QR code
            </Text>

            <Text className="text-base font-thin text-textSecondary text-center leading-6">
              Once you log in, you will find your QR code here.
            </Text>
          </View>

          <TouchableOpacity
            className="w-full py-5 rounded-sm bg-primary items-center justify-center"
            onPress={() => router.push(AUTH_ROUTE.onboarding)}
            activeOpacity={0.8}
          >
            <Text className="text-base font-normal text-white text-center">
              Log in or Sign up
            </Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
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
      );
    }
  };

  return <View className="flex-1 bg-surface">{renderBody()}</View>;
};

export default MyQRScreen;
