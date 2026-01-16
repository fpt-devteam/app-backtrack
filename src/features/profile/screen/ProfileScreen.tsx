import { useAppUser } from "@/src/features/auth/providers";
import { AppHeader } from "@/src/shared/components";
import { auth } from "@/src/shared/lib/firebase";
import { signOut } from "firebase/auth";
import React from "react";
import { Button, Text, View } from "react-native";

export default function ProfileScreen() {
  const { user } = useAppUser();

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <View>
      <AppHeader title="Profile" showBackButton={false} />
      <Text>Welcome, {user?.displayName || "User"}!</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}
