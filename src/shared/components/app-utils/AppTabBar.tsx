import PostCreateButton from "@/src/features/post/components/PostCreateButton";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

const AppTabBar = () => {
  return (
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

        tabBarLabelStyle: {
          fontSize: 10,
        },
      }}
    >
      <Tabs.Screen
        name="posts"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={24}
              color={color}
            />
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
          tabBarButton: () => <PostCreateButton />,
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
  );
}

export default AppTabBar;
