import { Stack } from "expo-router";
import React from "react";

const UserPostLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: true, headerBackVisible: false }}
      />

      <Stack.Screen
        name="[postId]/index"
        options={{ headerShown: true, headerBackVisible: false }}
      />

      <Stack.Screen name="[postId]/edit" />
    </Stack>
  );
};

export default UserPostLayout;
