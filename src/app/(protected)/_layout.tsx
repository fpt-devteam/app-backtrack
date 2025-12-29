import { useAuth } from "@/src/features/auth/providers";
import { AppHeader } from "@/src/shared/components";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import { View } from "react-native";

export default function ProtectedLayout() {
  const { isAppReady, isLoggedIn } = useAuth();
  console.log("Protected layout");

  if (!isAppReady) return null;

  if (!isLoggedIn) return <Redirect href="/login" />;

  return (
    <View className="flex-1">
      <AppHeader
        onPressAdd={() => { }}
        onPressBell={() => { }}
      />

      <Tabs screenOptions={{
        headerShown: false
      }}>
        <Tabs.Screen
          name="posts"
          options={{
            title: "Lost & Found",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="location-outline" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="(qr)"
          options={{
            title: "QR",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="qr-code-outline" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="(message)"
          options={{
            title: "Message",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="chatbox-outline" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="(profile)"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

