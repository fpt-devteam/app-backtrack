import { AppBackButton } from "@/src/shared/components";
import { QR_ROUTE } from "@/src/shared/constants";
import { colors } from "@/src/shared/theme/colors";
import { router, Stack } from "expo-router";
import { View } from "moti";
import { GearSixIcon, MagicWandIcon } from "phosphor-react-native";
import React, { useCallback } from "react";
import { Pressable } from "react-native-gesture-handler";

const QrLayout = () => {
  const handleEditQRProfile = useCallback(() => {
    router.push(QR_ROUTE.customize);
  }, []);

  const handleNavigateSettingScreen = useCallback(() => {
    router.push(QR_ROUTE.profileSetting);
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          headerTitle: "Backtrack QR",
          headerLeft: () => <AppBackButton />,
          headerRight: () => (
            <View className="flex-row gap-4 px-2 items-center">
              {/* Edit QR Profile */}
              <Pressable onPress={handleEditQRProfile} hitSlop={10}>
                <MagicWandIcon size={24} color={colors.black} weight="bold" />
              </Pressable>
              {/* Edit Profile Setting */}
              <Pressable onPress={handleNavigateSettingScreen} hitSlop={10}>
                <GearSixIcon size={24} color={colors.black} weight="bold" />
              </Pressable>
            </View>
          ),

          presentation: "card",
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen name="purchase" />
      <Stack.Screen name="qr-profile-setting" />
      <Stack.Screen name="qr-profile" />
      <Stack.Screen name="qr-customize" />
    </Stack>
  );
};

export default QrLayout;
