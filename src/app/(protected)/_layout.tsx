import { useAuth } from "@/src/features/auth/providers";
import { BottomTabBar } from "@/src/shared/components";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProtectedLayout() {
  const { isAppReady, isLoggedIn } = useAuth();
  console.log("Protected layout");

  if (!isAppReady) return null;
  // if (!isLoggedIn) return <Redirect href="/login" />;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <BottomTabBar />
    </SafeAreaView>
  );
}
