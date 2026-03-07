import { useAppUser } from "@/src/features/auth/providers";
import {
  IS_QR_FEATURE_MOCK,
  MOCK_QR_CODE,
  MOCK_QR_PLAN_DATA,
} from "@/src/features/qr/constants";
import { useGetMyQR } from "@/src/features/qr/hooks";
import { AppLoader } from "@/src/shared/components/app-utils/AppLoader";
import { QR_ROUTE } from "@/src/shared/constants";
import { colors } from "@/src/shared/theme";
import { ExternalPathString, RelativePathString, router } from "expo-router";
import { LockKeyIcon } from "phosphor-react-native";
import React, { useCallback, useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

type UserQRCodeCardProps = {
  isSubscripted: boolean;
};

export const UserQRCodeCard = ({ isSubscripted }: UserQRCodeCardProps) => {
  const { data: qrCode, isLoading: isQRLoading } = useGetMyQR();
  const { user } = useAppUser();

  const logoSource = useMemo(
    () => (user?.avatar ? { uri: user.avatar } : undefined),
    [user?.avatar],
  );

  const publicCode = useMemo(() => {
    if (IS_QR_FEATURE_MOCK) return MOCK_QR_CODE.publicCode;
    return qrCode?.publicCode;
  }, [qrCode?.publicCode]);

  const isUserSubscripted = useMemo(() => {
    if (IS_QR_FEATURE_MOCK) return MOCK_QR_PLAN_DATA.isActive;
    return isSubscripted;
  }, [isSubscripted]);

  const handlePreviewProfile = useCallback(() => {
    if (!qrCode) return;
    router.push(QR_ROUTE.profile as ExternalPathString | RelativePathString);
  }, [qrCode]);

  if (isQRLoading || !qrCode) {
    return (
      <View
        className="bg-white rounded-3xl items-center justify-center border border-slate-100 w-full"
        style={{ padding: 28, height: 340 }}
      >
        <AppLoader size={28} gap={6} />
      </View>
    );
  }

  if (!isUserSubscripted) {
    return (
      <View
        className="bg-white rounded-3xl border border-slate-100 w-full items-center justify-center"
        style={{ padding: 28, height: 340 }}
      >
        <View className="w-52 h-52 rounded-2xl bg-slate-100 items-center justify-center mb-4">
          <View className="w-16 h-16 rounded-full bg-white items-center justify-center shadow-sm">
            <LockKeyIcon size={28} color={colors.primary} weight="fill" />
          </View>
        </View>
        <Text className="text-sm font-semibold text-slate-700">QR Locked</Text>
        <Text className="text-base text-slate-400 text-center mt-1">
          Subscribe to unlock your Backtrack QR
        </Text>
      </View>
    );
  }

  return (
    <Pressable
      onPress={handlePreviewProfile}
      className="bg-white rounded-3xl items-center justify-center shadow-sm border border-slate-100 p-4"
    >
      <QRCode
        value={publicCode}
        size={260}
        logo={logoSource}
        logoSize={56}
        logoBorderRadius={28}
        logoBackgroundColor="white"
        logoMargin={4}
        quietZone={10}
      />
    </Pressable>
  );
};
