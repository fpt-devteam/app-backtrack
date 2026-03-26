import { Stack } from "expo-router";
import React from "react";

const ProfileLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="menu-tab"
        options={{
          title: "Menu",
          headerShown: false,
          animation: "slide_from_left",
          presentation: "transparentModal",
          gestureDirection: "horizontal",
        }}
      />
    </Stack>
  );
};

export default ProfileLayout;
