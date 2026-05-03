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
        name="[postId]"
        options={{ headerShown: true, headerBackVisible: false }}
      />
    </Stack>
  );
};

export default UserPostLayout;
