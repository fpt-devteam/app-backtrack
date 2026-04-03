import { typography } from "@/src/shared/theme";
import { Stack } from "expo-router";
import React from "react";
import { TextStyle } from "react-native/Libraries/StyleSheet/StyleSheetTypes";

const ChatLayout = () => {
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
          headerTitle: "Inbox",
          headerTitleStyle: {
            fontSize: typography.presets.screenTitle
              .fontSize as TextStyle["fontSize"],
            fontWeight: typography.presets.screenTitle
              .fontWeight as TextStyle["fontWeight"],
          },
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
};

export default ChatLayout;
