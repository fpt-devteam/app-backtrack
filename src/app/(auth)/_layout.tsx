import { useAuth } from "@/src/features/auth/providers";
import { AppBackButton } from "@/src/shared/components";
import { POST_ROUTE } from "@/src/shared/constants";
import { colors, typography } from "@/src/shared/theme";
import { Redirect, Stack } from "expo-router";
import React from "react";
import { TextStyle } from "react-native";

function PublicLayout() {
  const { isAppReady, isLoggedIn } = useAuth();

  if (!isAppReady) return null;

  if (isLoggedIn) return <Redirect href={POST_ROUTE.index} />;

  return (
    <Stack>
      <Stack.Screen
        name="onboarding"
        options={{
          headerRight: () => <AppBackButton type="xIcon" />,
          headerTransparent: true,
          headerTitle: "",
        }}
      />

      <Stack.Screen
        name="login"
        options={{
          headerTitle: "Login",
          headerTitleStyle: {
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.normal as TextStyle["fontWeight"],
            color: colors.text.primary,
          },
          headerLeft: () => <AppBackButton />,
        }}
      />

      <Stack.Screen
        name="register"
        options={{
          headerTitle: "Register new account",
          headerTitleStyle: {
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.normal as TextStyle["fontWeight"],
            color: colors.text.primary,
          },
          headerLeft: () => <AppBackButton />,
        }}
      />

      <Stack.Screen
        name="password-reset"
        options={{
          headerTitle: "Forgot password?",
          headerTitleStyle: {
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.normal as TextStyle["fontWeight"],
            color: colors.text.primary,
          },
          headerLeft: () => <AppBackButton />,
        }}
      />

      <Stack.Screen name="verify-email" />

      <Stack.Screen name="verify-phone-input" />

      <Stack.Screen name="verify-phone" />
    </Stack>
  );
}
export default PublicLayout;
