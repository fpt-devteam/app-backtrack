import { useAuth } from "@/src/features/auth/providers";
import { AppBackButton } from "@/src/shared/components";
import { typography } from "@/src/shared/theme";
import { Stack } from "expo-router";
import React from "react";
import { TextStyle } from "react-native";

const ProfileLayout = () => {
  const { isAppReady, isLoggedIn } = useAuth();
  const isAuthReady = isAppReady && isLoggedIn;

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />

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
          headerShown: true,
          title: "Edit Profile",
          presentation: "modal",
          animation: "slide_from_bottom",
          headerRight: () => (
            <AppBackButton type={"xIcon"} showBackground={true} />
          ),
          headerLeft: () => null,
          headerShadowVisible: true,
          headerTitleStyle: {
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.normal as TextStyle["fontWeight"],
          },
        }}
      />

      <Stack.Screen
        name="password"
        options={{
          headerShown: true,
          title: "Change Password",
          headerRight: () => (
            <AppBackButton type={"xIcon"} showBackground={true} />
          ),
          presentation: "modal",
          headerTitleStyle: {
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.normal as TextStyle["fontWeight"],
          },
        }}
      />

      <Stack.Screen
        name="detail"
        options={{
          headerShown: false,
          title: "Profile",
          animation: "slide_from_right",
          presentation: "card",
          gestureDirection: "horizontal",
        }}
      />

      <Stack.Screen name="user-posts" options={{ headerShown: false }} />
      <Stack.Screen name="qr" options={{ headerShown: false }} />
    </Stack>
  );
};

export default ProfileLayout;
