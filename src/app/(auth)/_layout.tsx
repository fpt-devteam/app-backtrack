import { useAuth } from "@/src/features/auth/providers";
import { AppBackButton } from "@/src/shared/components";
import { POST_ROUTE } from "@/src/shared/constants";
import { colors, typography } from "@/src/shared/theme";
import { Redirect, RelativePathString, Stack } from "expo-router";
import React from "react";
import { TextStyle } from "react-native";

function PublicLayout() {
  const { isAppReady, isLoggedIn } = useAuth();

  if (!isAppReady) return null;

  if (isLoggedIn)
    return <Redirect href={POST_ROUTE.index as RelativePathString} />;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: "modal",
        animation: "slide_from_bottom",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          headerRight: () => <AppBackButton type="xIcon" />,
          headerTransparent: true,
          headerTitle: "",
        }}
      />

      <Stack.Screen
        name="login"
        options={{
          headerShown: true,
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
          headerShown: true,
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
          headerShown: true,
          headerTitle: "Forgot password?",
          headerTitleStyle: {
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.normal as TextStyle["fontWeight"],
            color: colors.text.primary,
          },
          headerLeft: () => <AppBackButton />,
        }}
      />

      <Stack.Screen name="verify-email" options={{ headerShown: true }} />
      <Stack.Screen name="verify-phone-input" options={{ headerShown: true }} />
      <Stack.Screen name="verify-phone" options={{ headerShown: true }} />
    </Stack>
  );
}
export default PublicLayout;
