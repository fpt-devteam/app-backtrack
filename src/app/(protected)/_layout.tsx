import { useAuth } from "@/src/features/auth/providers";
import { LocationSelectionProvider } from "@/src/features/location/store";
import { Redirect, Stack } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProtectedLayout() {
  const { isAppReady, isLoggedIn } = useAuth();

  if (!isAppReady) return null;
  if (!isLoggedIn) return <Redirect href="/login" />;

  return (
    <LocationSelectionProvider>
      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="(bottom-sheet)/qr-menu"
            options={{
              presentation: "transparentModal",
              animation: "fade",
              contentStyle: { backgroundColor: "transparent" },
            }}
          />
        </Stack>
      </SafeAreaView>
    </LocationSelectionProvider>
  );
}
