import { Stack } from "expo-router";

export default function PostsStackLayout() {
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: "transparent" },
      }}
    >
      <Stack.Screen name="[postId]" />

      <Stack.Screen name="search/index" options={{ headerShown: false }} />

      <Stack.Screen name="search/result" />

      <Stack.Screen
        name="search/filter"
        options={{
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
