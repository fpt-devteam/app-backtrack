import { AppBackButton } from "@/src/shared/components";
import { QR_ROUTE } from "@/src/shared/constants";
import { typography } from "@/src/shared/theme/typography";
import { router, Stack } from "expo-router";
import React, { useCallback } from "react";
import { TextStyle } from "react-native";

const QrLayout = () => {
  const handleNavigateSettingScreen = useCallback(() => {
    router.push(QR_ROUTE.qrProfileSetting);
  }, []);

  return (
    <Stack>
      <Stack.Screen name="qr" />

      <Stack.Screen
        name="purchase"
        options={{
          headerTitle: "Subscription Plans",
          headerLeft: () => <AppBackButton />,

          headerTitleStyle: {
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeight.normal as TextStyle["fontWeight"],
          },

          presentation: "card",
          animation: "slide_from_right",
        }}
      />

      <Stack.Screen name="qr-profile-setting" />

      <Stack.Screen
        name="qr-profile"
        options={{
          headerTitle: "QR Profile",
          headerLeft: () => <AppBackButton />,

          headerTitleStyle: {
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeight.normal as TextStyle["fontWeight"],
          },

          presentation: "card",
          animation: "slide_from_right",
        }}
      />
    </Stack>
  );
};

export default QrLayout;
