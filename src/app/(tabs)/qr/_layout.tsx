import { Stack } from "expo-router";
import React from "react";

const QrLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          headerTitle: "Backtrack QR",
          headerTitleStyle: {
            fontSize: 24,
            fontWeight: 500,
          },
        }}
      />
      <Stack.Screen name="purchase" />
      <Stack.Screen name="qr-profile-setting" />
      <Stack.Screen name="qr-profile" />
      <Stack.Screen name="qr-customize" />
    </Stack>
  );
};

export default QrLayout;
