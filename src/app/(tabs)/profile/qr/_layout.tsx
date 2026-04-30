import { AppBackButton } from "@/src/shared/components";
import { QR_ROUTE } from "@/src/shared/constants";
import { colors } from "@/src/shared/theme/colors";
import { typography } from "@/src/shared/theme/typography";
import { router, Stack } from "expo-router";
import { View } from "moti";
import { GearSixIcon, MagicWandIcon } from "phosphor-react-native";
import React, { useCallback } from "react";
import { TextStyle } from "react-native";
import { Pressable } from "react-native-gesture-handler";

const QrLayout = () => {
  const handleEditQRProfile = useCallback(() => {
    router.push(QR_ROUTE.customize);
  }, []);

  const handleNavigateSettingScreen = useCallback(() => {
    router.push(QR_ROUTE.profileSetting);
  }, []);

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Backtrack QR",
          headerLeft: () => <AppBackButton />,
          headerRight: () => (
            <View className="flex-row gap-md2 px-2 items-center">
              {/* Edit QR Profile */}
              <Pressable onPress={handleEditQRProfile} hitSlop={10}>
                <MagicWandIcon size={24} color={colors.black} />
              </Pressable>

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

      <Stack.Screen name="qr-customize" />
    </Stack>
  );
};

export default QrLayout;
