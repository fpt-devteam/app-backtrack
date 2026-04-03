import { useAuth } from "@/src/features/auth/providers";
import { POST_ROUTE } from "@/src/shared/constants";
import { Redirect, RelativePathString, Stack } from "expo-router";
import React from "react";

function PublicLayout() {
  const { isAppReady, isLoggedIn } = useAuth();

  if (!isAppReady) return null;

  if (isLoggedIn)
    return <Redirect href={POST_ROUTE.index as RelativePathString} />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="password-reset" />
      <Stack.Screen name="verify-email" />
    </Stack>
  );
}
export default PublicLayout;
