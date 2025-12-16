import { auth } from "@/src/lib/firebase";
import { useAuth } from "@/src/providers/AuthProvider";
import { signOut } from "firebase/auth";
import React from "react";
import { Button, Text, View } from "react-native";

export default function Profile() {
  const { clearSession } = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
    await clearSession();
  };

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text>Profile</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}
