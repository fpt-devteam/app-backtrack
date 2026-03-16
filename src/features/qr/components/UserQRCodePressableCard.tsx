import { useAppUser } from "@/src/features/auth/providers";
import { IS_QR_FEATURE_MOCK, MOCK_QR_CODE } from "@/src/features/qr/constants";
import { useGetMyQR } from "@/src/features/qr/hooks";
import { AppLoader } from "@/src/shared/components/app-utils/AppLoader";
import { QR_ROUTE } from "@/src/shared/constants";
import { colors } from "@/src/shared/theme";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { LockKeyIcon } from "phosphor-react-native";
import React, { useCallback, useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { PremiumCTAButton } from "./PremiumCTAButton";

type UserQRCodePressableCardProps = {
  isSubscripted: boolean;
};

export const UserQRCodePressableCard = ({
  isSubscripted,
}: UserQRCodePressableCardProps) => {
  const { data: qrCode, isLoading: isQRLoading } = useGetMyQR();
  const { user } = useAppUser();

  const logoSource = useMemo(
    () => (user?.avatar ? { uri: user.avatar } : undefined),
    [user?.avatar],
  );

  const qrValue = useMemo(() => {
    const code = IS_QR_FEATURE_MOCK
      ? MOCK_QR_CODE.publicCode
      : qrCode?.publicCode;
    return "https://thebacktrack.vercel.app/profile/" + code;
  }, [qrCode?.publicCode]);

  const handlePreviewProfile = useCallback(() => {
    if (!qrCode) return;
    router.push(QR_ROUTE.profile);
  }, [qrCode]);

  const handleUpgrade = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(QR_ROUTE.purchase);
  }, []);

  if (isQRLoading || !qrCode) {
    return (
      <View className="bg-white rounded-3xl items-center justify-center border border-slate-100 w-full">
        <AppLoader size={28} gap={6} />
      </View>
    );
  }

  if (!isSubscripted) {
    return (
      <View
        className="bg-white rounded-3xl border border-slate-100 w-full items-center p-6 gap-4"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
          elevation: 2,
        }}
      >
        <View className="relative items-center justify-center mb-6 mt-2">
          <View style={{ opacity: 0.08 }}>
            <QRCode
              value="https://backtrack.vn/locked"
              size={180}
              color={colors.slate[900]}
            />
          </View>

          <View
            className="absolute z-10 w-20 h-20 rounded-full bg-white items-center justify-center shadow-xl"
            style={{ borderWidth: 4, borderColor: colors.slate[50] }}
          >
            <LockKeyIcon size={36} color={colors.primary} weight="fill" />
          </View>
        </View>

        <View className="items-center px-4">
          <View className="flex-row items-center mb-1">
            <Text className="text-xl font-bold text-slate-800">QR Locked</Text>
          </View>
          <Text className="text-sm text-slate-500 text-center leading-5">
            Upgrade to Backtrack Pro to create your personalized QR code
          </Text>
        </View>

        {/* Upgrade Button */}
        <PremiumCTAButton onPress={handleUpgrade} />
      </View>
    );
  }

  return (
    <Pressable
      onPress={handlePreviewProfile}
      className="bg-white rounded-3xl items-center justify-center shadow-sm border border-slate-100 p-8"
    >
      <View className="items-center">
        <QRCode
          value={qrValue}
          size={240}
          logo={logoSource}
          logoSize={60}
          logoBorderRadius={30}
          logoBackgroundColor="white"
          logoMargin={4}
          quietZone={10}
        />
        <Text className="mt-6 text-xs font-medium  tracking-widest text-primary">
          Tap to preview your public profile
        </Text>
      </View>
    </Pressable>
  );
};
