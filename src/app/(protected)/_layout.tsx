import { useAuth } from "@/src/features/auth/providers";
import { AppFooter, AppHeader } from "@/src/shared/components";
import { Redirect } from "expo-router";
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
        <AppFooter />
      </ChromeVisibilityProvider>
    </SafeAreaView>
  );
}
