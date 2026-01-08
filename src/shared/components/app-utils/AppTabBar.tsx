import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React, { useState } from "react";
import { Pressable } from "react-native";
import AppCreateActionsSheet from "./AppCreateActionsSheet";

const AppTabBar = () => {
  const [openSheet, setOpenSheet] = useState(false);
  const closeSheet = () => setOpenSheet(false);

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarStyle: {
            backgroundColor: "white",
            height: 56,
            borderTopWidth: 1,
            borderTopColor: "#E5E5EA",
          },
          tabBarActiveTintColor: "#007AFF",
          tabBarInactiveTintColor: "#8E8E93",
          tabBarLabelStyle: { fontSize: 10 },
        }}
      >
        <Tabs.Screen
          name="posts"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="(qr)"
          options={{
            title: "QRs",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "qr-code" : "qr-code-outline"}
                size={24}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="create-post"
          options={{
            title: "",
            tabBarLabel: () => null,
            tabBarButton: () => (
              <Pressable onPress={() => {
                console.log("Clicked create post button");
                setOpenSheet(true);
              }} className="w-[56px] h-[56px] rounded-full bg-primary items-center justify-center">
                <Ionicons name="add" size={28} color="white" />
              </Pressable>
            ),
          }}
        />

        <Tabs.Screen
          name="chat"
          options={{
            title: "Chat",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "chatbox" : "chatbox-outline"}
                size={24}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="notification"
          options={{
            title: "Inbox",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "notifications" : "notifications-outline"}
                size={24}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen name="(profile)" options={{ href: null }} />
      </Tabs>

      {/* Bottom Sheet Actions */}
      <AppCreateActionsSheet isVisible={openSheet} onClose={closeSheet} />
    </>
  );
};

export default AppTabBar;
