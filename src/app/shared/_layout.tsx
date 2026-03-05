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
    </Stack>
  );
};

export default SharedScreensLayout;
