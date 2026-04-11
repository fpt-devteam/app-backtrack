import { TabBarContent } from "@/src/shared/components/app-utils/TabBarContent";
import { Tabs } from "expo-router";
import React from "react";

export const BottomTabBar = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
      tabBar={(props) => <TabBarContent {...props} />}
    >
      <Tabs.Screen name="post" />
      <Tabs.Screen name="handover" />
      <Tabs.Screen name="chat" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
};
