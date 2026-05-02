import { Stack } from "expo-router";
import React from "react";

const SharedScreensLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="[userId]"
        options={{
          headerShown: true,
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />

      <Stack.Screen name="verify-phone-input" options={{ headerShown: true }} />
      <Stack.Screen name="verify-phone" options={{ headerShown: true }} />
    </Stack>
  );
};

export default SharedScreensLayout;
