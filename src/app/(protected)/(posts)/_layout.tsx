import { Stack } from "expo-router";

export default function PostsStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="create" />
    </Stack>
  );
}
