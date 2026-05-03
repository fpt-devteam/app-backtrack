import { Stack } from "expo-router";
import React from "react";

const SharedScreensLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="matching/[postId]/index" />

      <Stack.Screen
        name="matching/[postId]/[otherPostId]"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default SharedScreensLayout;
