import { useGetMyQR } from "@/src/features/qr/hooks";
import { AppLoader } from "@/src/shared/components/AppLoader";
import { QR_ROUTE } from "@/src/shared/constants";
import { colors } from "@/src/shared/theme";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { LockKeyIcon } from "phosphor-react-native";
import React, { useCallback, useMemo } from "react";
import type { ViewStyle } from "react-native";
import { Pressable, Text, useWindowDimensions, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { PremiumCTAButton } from "./PremiumCTAButton";

const CARD_SHADOW: ViewStyle = {
  shadowColor: colors.black,
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.2,
  shadowRadius: 8,
  elevation: 4,
};

export type QRSvgRef = { toDataURL: (cb: (data: string) => void) => void };

type UserQRCodePressableCardProps = {
  isSubscripted: boolean;
  qrRef?: React.MutableRefObject<QRSvgRef | null>;
};

export const UserQRCodePressableCard = ({
  isSubscripted,
  qrRef,
}: UserQRCodePressableCardProps) => {
  const { width } = useWindowDimensions();
  const { data: qrCode, isLoading: isQRLoading } = useGetMyQR();

  const logoSource = useMemo(() => {
    const url = qrCode?.logoUrl;
    return url ? { uri: url } : undefined;
  }, [qrCode?.logoUrl]);

  const qrValue = useMemo(() => {
    return "https://thebacktrack.vercel.app/profile/" + qrCode?.publicCode;
  }, [qrCode?.publicCode]);

  const handlePreviewProfile = useCallback(() => {
    if (!qrCode) return;
    router.push(QR_ROUTE.qrProfile);
  }, [qrCode]);

  const handleUpgrade = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(QR_ROUTE.purchase);
  }, []);

  if (isQRLoading || !qrCode) {
    return (
      <View
        className="bg-surface rounded-xl items-center justify-center border border-divider w-full"
        style={CARD_SHADOW}
      >
        <AppLoader />
      </View>
    );
  }

  if (!isSubscripted) {
    return (
      <View
        className="bg-surface rounded-xl border border-divider w-full items-center p-6 gap-4"
        style={CARD_SHADOW}
      >
        <View className="relative items-center justify-center mb-6 mt-2">
          <View style={{ opacity: 0.08 }}>
            <QRCode
              value="https://backtrack.vn/locked"
              size={180}
              color={colors.hof[900]}
            />
          </View>

          <View
            className="absolute z-10 w-20 h-20 rounded-full bg-surface items-center justify-center"
            style={{
              borderWidth: 3,
              borderColor: colors.divider,
              shadowColor: colors.black,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <LockKeyIcon size={36} color={colors.primary} weight="thin" />
          </View>
        </View>

        <View className="items-center px-4">
          <Text className="text-xl font-bold text-textPrimary mb-1">
            QR Locked
          </Text>
          <Text className="text-sm text-textSecondary text-center leading-5">
            Upgrade to Backtrack Pro to create your personalized QR code
          </Text>
        </View>

        <PremiumCTAButton onPress={handleUpgrade} />
      </View>
    );
  }

  return (
    <Pressable
      onPress={handlePreviewProfile}
      className="bg-surface rounded-xl items-center justify-center border border-divider p-md w-full"
      style={CARD_SHADOW}
    >
      <QRCode
        value={qrValue}
        size={width * 0.8}
        logo={logoSource}
        logoSize={60}
        logoBorderRadius={30}
        logoBackgroundColor="white"
        logoMargin={4}
        quietZone={10}
        getRef={(ref) => {
          if (qrRef) qrRef.current = ref as QRSvgRef | null;
        }}
      />
    </Pressable>
  );
};
