import { useAuth } from "@/src/features/auth/providers";
import { AppHeader } from "@/src/shared/components";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import React, { createContext, useCallback, useContext, useRef, useState } from "react";
import { Animated, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HEADER_HEIGHT = 64;
const ANIMATION_DURATION = 200;

interface ChromeVisibilityContextType {
  setChromeVisible: (visible: boolean) => void;
  isChromeVisible: boolean;
}

const ChromeVisibilityContext = createContext<ChromeVisibilityContextType>({
  setChromeVisible: () => { },
  isChromeVisible: true,
});

export const useChromeVisibility = () => useContext(ChromeVisibilityContext);

function ChromeVisibilityProvider({ children }: { children: React.ReactNode }) {
  const [isChromeVisible, setIsChromeVisible] = useState(true);
  const headerAnim = useRef(new Animated.Value(1)).current;
  const tabBarAnim = useRef(new Animated.Value(1)).current;

  const setChromeVisible = useCallback((visible: boolean) => {
    setIsChromeVisible(visible);

    Animated.parallel([
      Animated.timing(headerAnim, {
        toValue: visible ? 1 : 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(tabBarAnim, {
        toValue: visible ? 1 : 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
    ]).start();
  }, [headerAnim, tabBarAnim]);

  return (
    <ChromeVisibilityContext.Provider value={{ setChromeVisible, isChromeVisible }}>
      <View className="flex-1" style={{ backgroundColor: 'transparent' }}>
        <Animated.View
          style={{
            opacity: headerAnim,
            transform: [
              {
                translateY: headerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-HEADER_HEIGHT, 0],
                }),
              },
            ],
            backgroundColor: 'transparent',
          }}
          pointerEvents={isChromeVisible ? 'auto' : 'none'}
        >
          <AppHeader />
        </Animated.View>

        <View style={{ flex: 1 }}>
          {children}
        </View>
      </View>
    </ChromeVisibilityContext.Provider>
  );
}

export default function ProtectedLayout() {
  const { isAppReady, isLoggedIn } = useAuth();
  console.log("Protected layout");

  if (!isAppReady) return null;
  if (!isLoggedIn) return <Redirect href="/login" />;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ChromeVisibilityProvider>
        <AppFooterTabBar />
      </ChromeVisibilityProvider>
    </SafeAreaView>
  );
}

function AppFooterTabBar() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,

        tabBarStyle: {
          backgroundColor: "white",
          height: 56,
          borderTopWidth: 1,
          borderTopColor: "rgba(15,23,42,0.08)",
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
          title: "Reports",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "location" : "location-outline"}
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

      {/* Ẩn profile khỏi tab bar */}
      <Tabs.Screen name="(profile)" options={{ href: null }} />
    </Tabs>
  );
}
