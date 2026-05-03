import { Stack } from "expo-router";
import React from "react";

const HandoverLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="[handoverId]" />
      <Stack.Screen name="all" />
    </Stack>
  );
};

export default HandoverLayout;
