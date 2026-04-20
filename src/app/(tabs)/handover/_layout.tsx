import { Stack } from "expo-router";
import React from "react";

const HandoverLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="[handoverId]" options={{ headerShown: false }} />
    </Stack>
  );
};

export default HandoverLayout;
