import { LocationSelectionProvider } from "@/src/features/map/store/location.store";
import { AppBackButton } from "@/src/shared/components";
import { typography } from "@/src/shared/theme";
import { Stack } from "expo-router";
import { TextStyle } from "react-native";

export default function PostsStackLayout() {
  return (
    <LocationSelectionProvider>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: "transparent" },
        }}
      >
        <Stack.Screen key="index" name="index" />

        <Stack.Screen key="[postId]/index" name="[postId]/index" />

        <Stack.Screen
          key="search/index"
          name="search/index"
          options={{
            headerShown: false,
            headerTransparent: true,
            contentStyle: { backgroundColor: "transparent" },
            animation: "fade_from_bottom",
          }}
        />

        <Stack.Screen
          key="search/filter"
          name="search/filter"
          options={{
            headerShown: true,
            headerTitle: "Filters",
            headerTitleStyle: {
              fontSize: typography.fontSize["2xl"],
              fontWeight: typography.fontWeight
                .normal as TextStyle["fontWeight"],
            },
            headerRight: () => <AppBackButton type="xIcon" />,
            presentation: "modal",
            animation: "slide_from_bottom",
          }}
        />

        <Stack.Screen key="search/result" name="search/result" />

        <Stack.Screen
          name="create"
          options={{
            headerShown: false,
            animation: "slide_from_bottom",
          }}
        />
      </Stack>
    </LocationSelectionProvider>
  );
}
