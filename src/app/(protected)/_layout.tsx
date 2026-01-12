import { useAuth } from "@/src/features/auth/providers";
import { LocationSelectionProvider } from "@/src/features/location/store";
import { BottomTabBar } from "@/src/shared/components";
import { Redirect } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProtectedLayout() {
  const { isAppReady, isLoggedIn } = useAuth();

  if (!isAppReady) return null;
  if (!isLoggedIn) return <Redirect href="/login" />;

  return (
    <LocationSelectionProvider>
      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
        <BottomTabBar />
      </SafeAreaView>
    </LocationSelectionProvider>
  );
}
