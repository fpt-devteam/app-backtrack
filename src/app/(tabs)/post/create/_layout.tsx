import { AppBackButton } from "@/src/shared/components";
import { colors } from "@/src/shared/theme/colors";
import { typography } from "@/src/shared/theme/typography";
import { router, Stack } from "expo-router";
import React from "react";
import { TextStyle } from "react-native";

const PostCreateLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          headerTitle: "",
          headerShadowVisible: false,
          headerRight: () => (
            <AppBackButton
              type="xIcon"
              onPress={() => {
                router.dismissAll();
              }}
            />
          ),
          headerTitleStyle: {
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.normal as TextStyle["fontWeight"],
            color: colors.text.primary,
          },
        }}
      />

      <Stack.Screen name="stepper" />

      <Stack.Screen name="[postId]" />
    </Stack>
  );
};

export default PostCreateLayout;
