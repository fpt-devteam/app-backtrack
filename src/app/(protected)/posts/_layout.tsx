import { colors } from "@/src/shared/theme/colors";
import { Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PostsStackLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="search/index"
        options={{
          headerShown: false,
          contentStyle: {
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
          },
        }}
      />

      <Stack.Screen
        name="search/location"
        options={{
          headerShown: false,
          contentStyle: {
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
          },
        }}
      />

      <Stack.Screen
        name="search/result"
        options={{
          headerShown: false,
          contentStyle: {
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
          },
        }}
      />

      <Stack.Screen
        name="create"
        options={{
          headerShown: false,
          contentStyle: {
            paddingTop: insets.top,
            backgroundColor: colors.white,
          },
        }}
      />
    </Stack>
  );
}
