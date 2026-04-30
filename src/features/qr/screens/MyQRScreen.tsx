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
import { AUTH_ROUTE } from "@/src/shared/constants";
import { colors } from "@/src/shared/theme/colors";
import { router } from "expo-router";
import { MotiView } from "moti";
import { LightbulbIcon, QrCodeIcon } from "phosphor-react-native";
import React, { useMemo } from "react";
import {
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TipCard = () => (
  <MotiView
    from={{ opacity: 0, translateY: 16 }}
    animate={{ opacity: 1, translateY: 0 }}
    transition={{ type: "timing", duration: 260, delay: 180 }}
  >
    <View
      className="flex-row items-start rounded-md border p-md2"
      style={{
        borderColor: colors.arches[300],
        backgroundColor: colors.arches[50],
      }}
    >
      <LightbulbIcon
        size={16}
        weight="fill"
        color={colors.arches[600]}
        style={{ marginTop: 1, marginRight: 8 }}
      />
      <Text
        className="flex-1 text-xs leading-relaxed"
        style={{ color: colors.arches[600] }}
      >
        Stick your QR on items for a higher chance of recovery.
      </Text>
    </View>
  </MotiView>
);

const MyQRScreen = () => {
  const { data: subscription } = useGetMySubscription();
  const { height } = useWindowDimensions();
  const { isAppReady, isLoggedIn } = useAuth();
  const isAuthReady = isAppReady && isLoggedIn;

  const isSubscripted = useMemo(() => {
    if (IS_QR_FEATURE_MOCK) return MOCK_QR_PLAN_DATA.isActive;
    return !!subscription && subscription.status === SubscriptionStatus.Active;
  }, [subscription]);

  if (!isAuthReady) {
    return (
      <SafeAreaView className="flex-1 bg-surface">
        <View
          className="flex-1 px-10 gap-10"
          style={{ paddingTop: height * 0.15, paddingBottom: height * 0.1 }}
        >
          <View className="flex-row justify-center">
            <QrCodeIcon size={128} color={colors.primary} weight="thin" />
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
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-surface px-lg pt-md pb-xl gap-md">
      {/* QR Card */}
      <View className="w-full items-center gap-md ">
        <UserQRCodePressableCard isSubscripted={isSubscripted} />
        <View className="w-full">
          <TipCard />
        </View>
      </View>

      {/* Subscription Plan Card */}
      {isSubscripted && <UserSubscriptionPlanPressableCard />}
    </View>
  );
};

export default MyQRScreen;
