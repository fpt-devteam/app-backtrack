import { Stack } from "expo-router";
import React from "react";

const HandoverLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="[handoverId]/index" />
      <Stack.Screen name="[handoverId]/evidence-upload" />
      <Stack.Screen name="all" />
    </Stack>
  );
};

export default HandoverLayout;
