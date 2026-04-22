import { Stack } from "expo-router";
import React from "react";

const PostMatchingLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="[otherPostId]" />
    </Stack>
  );
};

export default PostMatchingLayout;
