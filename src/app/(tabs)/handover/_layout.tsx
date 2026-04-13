import { AppBackButton } from "@/src/shared/components";
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
      <Stack.Screen
        name="[handoverId]"
        options={{
          headerShown: true,
          title: "Handover Details",
          headerLeft: () => <AppBackButton />,
        }}
      />
    </Stack>
  );
};

export default HandoverLayout;
