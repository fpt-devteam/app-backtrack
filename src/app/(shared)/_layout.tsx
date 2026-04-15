import { Stack } from "expo-router";
import React from "react";

const SharedScreensLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="not-available"
        options={{
          presentation: "transparentModal",
          animation: "fade",
        }}
      />

      <Stack.Screen
        name="[userId]"
        options={{
          headerShown: true,
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
    </Stack>
  );
};

export default SharedScreensLayout;
