import { AppBackButton } from "@/src/shared/components/AppBackButton";
import { typography } from "@/src/shared/theme/typography";
import { Stack } from "expo-router";
import React from "react";
import { TextStyle } from "react-native";

const UserPostLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: true, headerBackVisible: false }}
      />

      <Stack.Screen
        name="[postId]/index"
        options={{ headerShown: true, headerBackVisible: false }}
      />

      <Stack.Screen
        name="[postId]/edit"
        options={{
          headerTitle: "Update Post",
          headerTitleStyle: {
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeight.normal as TextStyle["fontWeight"],
          },
          headerLeft: () => <AppBackButton />,
        }}
      />
    </Stack>
  );
};

export default UserPostLayout;
