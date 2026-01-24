import { useAppUser } from "@/src/features/auth/providers";
import { AppHeader } from "@/src/shared/components";
import { auth } from "@/src/shared/lib/firebase";
import { signOut } from "firebase/auth";
import React from "react";
import { Button, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function ProfileScreen() {
  const { user } = useAppUser();

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <SafeAreaView>
      <AppHeader title="Profile" showBackButton={false} />
      <Text>Welcome, {user?.displayName || user?.email || "User"}!</Text>
      <Button title="Logout" onPress={handleLogout} />
    </SafeAreaView>
  );
}
