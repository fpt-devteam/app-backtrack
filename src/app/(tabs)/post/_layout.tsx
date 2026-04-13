import { LocationSelectionProvider } from "@/src/features/map/store/location.store";
import { AppBackButton } from "@/src/shared/components";
import { typography } from "@/src/shared/theme";
import { colors } from "@/src/shared/theme/colors";
import { Stack } from "expo-router";
import { TextStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PostsStackLayout() {
  const insets = useSafeAreaInsets();

  return (
    <LocationSelectionProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "transparent" },
        }}
      >
        <Stack.Screen name="index" />

        <Stack.Screen name="[postId]/index" options={{ headerShown: true }} />

        <Stack.Screen
          name="[postId]/handover-request"
          options={{
            headerShown: true,
            headerTitle: "Handover Request",
            headerTitleStyle: {
              fontSize: typography.fontSize.lg,
              fontWeight: typography.fontWeight
                .normal as TextStyle["fontWeight"],
            },
            headerRight: () => <AppBackButton type="xIcon" />,
            presentation: "modal",
            animation: "slide_from_bottom",
          }}
        />

        <Stack.Screen
          name="search/index"
          options={{
            headerShown: false,
            headerTransparent: true,
            contentStyle: { backgroundColor: "transparent" },
            animation: "fade_from_bottom",
          }}
        />

        <Stack.Screen
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

        <Stack.Screen name="search/result" />

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
          name="create"
          options={{
            headerShown: false,
            contentStyle: {
              paddingTop: insets.top,
              backgroundColor: colors.white,
            },
            presentation: "modal",
            animation: "slide_from_bottom",
          }}
        />

        <Stack.Screen
          name="[postId]/compare/[otherPostId]"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </LocationSelectionProvider>
  );
}
