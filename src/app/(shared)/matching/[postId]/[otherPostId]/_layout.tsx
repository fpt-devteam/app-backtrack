import { Stack } from "expo-router";
import React from "react";

const ComparePostLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="handover-request"
        options={{
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
    </Stack>
  );
};

export default ComparePostLayout;
