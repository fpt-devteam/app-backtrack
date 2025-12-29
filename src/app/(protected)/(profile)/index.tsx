import { auth } from "@/src/shared/lib/firebase";
import { signOut } from "firebase/auth";
import React from "react";
import { Button, Text, View } from "react-native";

export default function ProfileScreen() {
  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text>ProfileScreen</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}
