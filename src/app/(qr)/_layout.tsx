import { AppBackButton } from "@/src/shared/components";
import { QR_ROUTE } from "@/src/shared/constants";
import { colors } from "@/src/shared/theme/colors";
import { typography } from "@/src/shared/theme/typography";
import { router, Stack } from "expo-router";
import { View } from "moti";
import { GearSixIcon } from "phosphor-react-native";
import React, { useCallback } from "react";
import { TextStyle } from "react-native";
import { Pressable } from "react-native-gesture-handler";

const QrLayout = () => {
  const handleNavigateSettingScreen = useCallback(() => {
    router.push(QR_ROUTE.qrProfileSetting);
  }, []);

  return (
    <Stack>
      <Stack.Screen
        name="qr"
        options={{
          headerTitle: "Backtrack QR",
          headerLeft: () => <AppBackButton />,
          headerRight: () => (
            <View className="flex-row gap-md2 px-2 items-center">
              {/* Edit Profile Setting */}
              <Pressable onPress={handleNavigateSettingScreen} hitSlop={10}>
                <GearSixIcon size={24} color={colors.black} />
              </Pressable>
            </View>
          ),
          headerTitleStyle: {
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeight.normal as TextStyle["fontWeight"],
          },

          presentation: "card",
          animation: "slide_from_right",
        }}
      />

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
