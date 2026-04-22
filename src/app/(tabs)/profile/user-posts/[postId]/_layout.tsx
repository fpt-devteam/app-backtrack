import { Stack } from "expo-router";
import React from "react";

const PostDetailLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="edit" />
      <Stack.Screen
        name="[otherPostId]"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default PostDetailLayout;
