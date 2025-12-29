import { Stack } from "expo-router";

export default function PostsStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{
        headerShown: false,
      }} />
      <Stack.Screen name="create" />
    </Stack>
  );
}
