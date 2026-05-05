import type { QRSvgRef } from "@/src/features/qr/components";
import { UserQRCodePressableCard } from "@/src/features/qr/components";
import { useGetMySubscription } from "@/src/features/qr/hooks";
import { SubscriptionStatus } from "@/src/features/qr/types";
import {
  AppBackButton,
  AppTipCard,
  TouchableIconButton,
} from "@/src/shared/components";
import { AppLoader } from "@/src/shared/components/AppLoader";
import { toast } from "@/src/shared/components/ui/toast";
import { QR_ROUTE } from "@/src/shared/constants/route.constant";
import { typography } from "@/src/shared/theme";
import { colors } from "@/src/shared/theme/colors";
import * as FileSystem from "expo-file-system/legacy";
import { router, Stack } from "expo-router";
import * as Sharing from "expo-sharing";
import { DownloadSimpleIcon, GearSixIcon } from "phosphor-react-native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
} from "react-native";

const MyQRScreen = () => {
  const { data: subscription, isLoading } = useGetMySubscription();
  const qrRef = useRef<QRSvgRef | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const isSubscripted = useMemo(() => {
    return !!subscription && subscription.status === SubscriptionStatus.Active;
  }, [subscription]);

  const handleDownload = useCallback(async () => {
    if (!qrRef.current || isDownloading) return;
    setIsDownloading(true);
    try {
      qrRef.current.toDataURL(async (base64: string) => {
        try {
          const fileUri = `${FileSystem.cacheDirectory}qr-code.png`;
          await FileSystem.writeAsStringAsync(fileUri, base64, {
            encoding: FileSystem.EncodingType.Base64,
          });
          const canShare = await Sharing.isAvailableAsync();
          if (!canShare) {
            toast.error("Sharing not available on this device");
            return;
          }
          await Sharing.shareAsync(fileUri, {
            mimeType: "image/png",
            dialogTitle: "Save QR Code",
            UTI: "public.png",
          });
        } catch {
          toast.error("Save failed", "Could not save QR code");
        } finally {
          setIsDownloading(false);
        }
      });
    } catch {
      toast.error("Save failed", "Could not save QR code");
      setIsDownloading(false);
    }
  }, [isDownloading]);

  const handleNavigateSettingScreen = useCallback(() => {
    router.push(QR_ROUTE.qrProfileSetting);
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Backtrack QR",
          headerLeft: () => <AppBackButton />,
          headerRight: () =>
            isSubscripted && (
              <TouchableIconButton
                icon={<GearSixIcon size={24} color={colors.black} />}
                onPress={handleNavigateSettingScreen}
              />
            ),
          headerTitleStyle: {
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeight.normal as TextStyle["fontWeight"],
          },

          presentation: "card",
          animation: "slide_from_right",
        }}
      />
      <View className="flex-1 bg-surface px-lg pt-md pb-xl gap-md">
        {/* QR Card */}
        <View className="w-full items-center gap-md ">
          {isLoading ? (
            <AppLoader />
          ) : (
            <UserQRCodePressableCard
              isSubscripted={isSubscripted}
              qrRef={qrRef}
            />
          )}

          {/* Download Button */}
          {!isLoading && isSubscripted && (
            <TouchableOpacity
              onPress={handleDownload}
              disabled={isDownloading}
              activeOpacity={0.75}
              className="flex-row items-center justify-center gap-xs rounded-primary py-sm px-lg border border-divider bg-surface"
              style={{ opacity: isDownloading ? 0.6 : 1 }}
            >
              {isDownloading ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <DownloadSimpleIcon
                  size={18}
                  color={colors.primary}
                  weight="bold"
                />
              )}
              <Text className="text-sm font-normal text-primary">
                {isDownloading ? "Preparing..." : "Download QR"}
              </Text>
            </TouchableOpacity>
          )}

          {/* Tip Card */}
          <View className="w-full">
            <AppTipCard
              title="Pro Tip"
              description="Stick your QR on items for a higher chance of recovery."
              type="tip"
            />
          </View>
        </View>
      </View>
    </>
  );
};

export default MyQRScreen;
