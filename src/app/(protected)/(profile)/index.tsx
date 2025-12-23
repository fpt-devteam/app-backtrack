import { auth } from "@/src/lib/firebase";
import { useAuth } from "@/src/providers/AuthProvider";
import { ExternalPathString, useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import React from "react";
import { Button, Text, View } from "react-native";

export default function ProfileScreen() {
  const router = useRouter();
  const { clearSession } = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
    await clearSession();
  };

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text>ProfileScreen</Text>
      <Button title="Profile Information" onPress={() => {
        router.push(`/(protected)/(profile)/profileInformation` as ExternalPathString);
      }} />
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}
