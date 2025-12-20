import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import 'react-native-get-random-values';
import { AuthProvider } from "../providers/AuthProvider";

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }} >
        <Stack.Screen name="(protected)" />
        <Stack.Screen name="(public)" />
      </Stack>
    </AuthProvider>
  );
}
