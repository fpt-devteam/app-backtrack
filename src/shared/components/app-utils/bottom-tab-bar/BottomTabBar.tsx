import { Tabs } from "expo-router";
import React, { useState } from "react";
import AppCreateActionsSheet from "../AppCreateActionsSheet";
import { TabBarContent } from "./TabBarContent";

const BottomTabBar = () => {
  const [openSheet, setOpenSheet] = useState(false);
  const closeSheet = () => setOpenSheet(false);

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
        }}
        tabBar={(props) => (
          <TabBarContent {...props} onCreatePress={() => setOpenSheet(true)} />
        )}
      >
        <Tabs.Screen name="posts" options={{ title: "Home" }} />
        <Tabs.Screen name="(qr)" options={{ title: "QRs" }} />
        <Tabs.Screen name="create-post" options={{ title: "" }} />
        <Tabs.Screen name="chat" options={{ title: "Chat" }} />
        <Tabs.Screen name="notification" options={{ title: "Inbox" }} />
        <Tabs.Screen name="(profile)" options={{ href: null }} />
      </Tabs>

      {/* Bottom Sheet Actions */}
      <AppCreateActionsSheet isVisible={openSheet} onClose={closeSheet} />
    </>
  );
};

export default BottomTabBar;
