import { useAuth } from "@/src/features/auth/providers";
import { TouchableIconButton } from "@/src/shared/components";
import { PROFILE_ROUTE } from "@/src/shared/constants/route.constant";
import { typography } from "@/src/shared/theme";
import { colors } from "@/src/shared/theme/colors";
import { router, Stack } from "expo-router";
import { View } from "moti";
import { GearIcon, ListIcon, PencilSimpleIcon } from "phosphor-react-native";
import React from "react";
import { TextStyle } from "react-native";

const navigateToSettingScreen = () => {
  router.push(PROFILE_ROUTE.setting);
};

const navigateToEditProfileScreen = () => {
  router.push(PROFILE_ROUTE.edit);
};

const navigateToMenuTabScreen = () => {
  router.push(PROFILE_ROUTE.menuTab);
};

const ProfileHeaderLeft = () => (
  <TouchableIconButton
    onPress={navigateToMenuTabScreen}
    icon={<ListIcon size={28} color={colors.black} />}
  />
);

const ProfileHeaderRight = () => (
  <View className="flex-row gap-4">
    <TouchableIconButton
      onPress={navigateToEditProfileScreen}
      icon={<PencilSimpleIcon size={28} color={colors.black} />}
    />

    <TouchableIconButton
      onPress={navigateToSettingScreen}
      icon={<GearIcon size={28} color={colors.black} />}
    />
  </View>
);

const ProfileLayout = () => {
  const { isAppReady, isLoggedIn } = useAuth();
  const isAuthReady = isAppReady && isLoggedIn;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          headerTitle: "Profile",
          headerLeft: isAuthReady ? ProfileHeaderLeft : undefined,
          headerRight: isAuthReady ? ProfileHeaderRight : undefined,
          headerTitleStyle: {
            fontSize: typography.presets.screenTitle
              .fontSize as TextStyle["fontSize"],
            fontWeight: typography.presets.screenTitle
              .fontWeight as TextStyle["fontWeight"],
          },
        }}
      />

      <Stack.Screen
        name="menu-tab"
        options={{
          headerShown: false,
          title: "Menu",
          animation: "slide_from_left",
          presentation: "card",
          gestureDirection: "horizontal",
        }}
      />

      <Stack.Screen
        name="edit"
        options={{
          headerShown: false,
          title: "Edit Profile",
          animation: "slide_from_left",
          presentation: "card",
          gestureDirection: "horizontal",
        }}
      />

      <Stack.Screen
        name="setting"
        options={{
          headerShown: false,
          title: "Settings",
          animation: "slide_from_right",
          presentation: "card",
          gestureDirection: "horizontal",
        }}
      />
    </Stack>
  );
};

export default ProfileLayout;
