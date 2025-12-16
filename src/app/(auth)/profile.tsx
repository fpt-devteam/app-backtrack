import { auth } from "@/src/lib/firebase";
import { signOut } from "firebase/auth";
import React from "react";
import { Button, Text, View } from "react-native";

export default function Profile() {
  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text>Profile</Text>
      <Button title="Logout" onPress={() => signOut(auth)} />
    </View>
  );
}
