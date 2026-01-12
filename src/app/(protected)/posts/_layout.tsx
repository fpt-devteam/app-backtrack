import { Stack } from "expo-router";

export default function PostsStackLayout() {
  return (
    <Stack screenOptions={{
      headerShown: false,
    }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="create" />

      <Stack.Screen name="location" />

      <Stack.Screen
        name="search/location-search"
        options={{
          presentation: "transparentModal",
          animation: "fade",
          contentStyle: {
            backgroundColor: "transparent"
          },
        }}
      />
    </Stack>
  );
}
