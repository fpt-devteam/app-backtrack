import { Stack } from "expo-router";
import React from "react";

const HandoverLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: true }} />
      <Stack.Screen name="[handoverId]" options={{ headerShown: true }} />
      <Stack.Screen name="all" options={{ headerShown: true }} />
      <Stack.Screen
        name="conversations/[conversationId]"
        options={{ presentation: "modal", headerShown: false }}
      />
    </Stack>
  );
};

export default HandoverLayout;
