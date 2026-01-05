import { useAuth } from "@/src/features/auth/providers";
import { AppTabBar } from "@/src/shared/components";
import { Redirect } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProtectedLayout() {
  const { isAppReady, isLoggedIn } = useAuth();
  console.log("Protected layout");

  if (!isAppReady) return null;
  if (!isLoggedIn) return <Redirect href="/login" />;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <AppTabBar />
    </SafeAreaView>
  );
}
