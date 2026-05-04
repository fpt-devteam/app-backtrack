import { Stack } from "expo-router";
import React from "react";

const ProfileLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="edit"
        options={{
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />

      <Stack.Screen name="password" />

      <Stack.Screen name="detail" />

      <Stack.Screen name="user-posts/index" />

      <Stack.Screen name="user-posts/[postId]/index" />

      <Stack.Screen name="user-posts/[postId]/edit" />
    </Stack>
  );
};

export default ProfileLayout;
