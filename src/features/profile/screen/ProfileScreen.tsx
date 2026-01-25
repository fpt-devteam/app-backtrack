import { useAppUser } from "@/src/features/auth/providers";
import { useUnregisterDeviceMutation } from "@/src/features/notification/hooks";
import { AppHeader, HeaderTitle } from "@/src/shared/components";
import { auth } from "@/src/shared/lib/firebase";
import { signOut } from "firebase/auth";
import React from "react";
import { Button, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function ProfileScreen() {
  const { user } = useAppUser();
  const { mutateAsync: unregisterDevice } = useUnregisterDeviceMutation();

  const handleLogout = async () => {
    await unregisterDevice();
    await signOut(auth);
  };

  return (
    <SafeAreaView>
      <AppHeader left={<HeaderTitle title="Profile" />} />
      <Text>Welcome, {user?.displayName || user?.email || "User"}!</Text>
      <Button title="Logout" onPress={handleLogout} />
    </SafeAreaView>
  );
}
