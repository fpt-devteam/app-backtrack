import { Tabs } from "expo-router";
import React from "react";
import { TabBarContent } from "./TabBarContent";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarHideOnKeyboard: true }}
      tabBar={(props) => <TabBarContent {...props} />}
    >
      <Tabs.Screen name="posts" options={{ title: "Home" }} />
      <Tabs.Screen name="map" options={{ title: "Map" }} />
      <Tabs.Screen name="qr" options={{ title: "QRs" }} />
      <Tabs.Screen name="chat" options={{ title: "Chat" }} />
      <Tabs.Screen name="notification" options={{ title: "Inbox" }} />
    </Tabs>
  );
}
