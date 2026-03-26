import { useAuth } from "@/src/features/auth/providers";
import { LocationSelectionProvider } from "@/src/features/map/store";
import { Redirect, Stack } from "expo-router";
import React from "react";

export default function ProtectedLayout() {
  const { isAppReady, isLoggedIn } = useAuth();

  if (!isAppReady) return null;
  if (!isLoggedIn) return <Redirect href="/login" />;

  return (
    <LocationSelectionProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="posts"
          options={{
            presentation: "card",
            animation: "fade_from_bottom",
          }}
        />
        <Stack.Screen name="profile" />
      </Stack>
    </LocationSelectionProvider>
  );
}
