import { AppBackButton } from "@/src/shared/components";
import { typography } from "@/src/shared/theme";
import { Stack } from "expo-router";
import React from "react";
import { TextStyle } from "react-native/Libraries/StyleSheet/StyleSheetTypes";

const ChatLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" />

      <Stack.Screen
        name="[conversationId]/information"
        options={{
          headerTitle: "Details",
          headerTitleStyle: {
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.normal as TextStyle["fontWeight"],
          },
          headerRight: () => <AppBackButton type="xIcon" />,
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
    </Stack>
  );
};

export default ChatLayout;
