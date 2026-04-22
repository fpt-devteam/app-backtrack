import "@/global.css";
import { AppUserProvider, AuthProvider } from "@/src/features/auth/providers";
import { toastConfig } from "@/src/shared/components/ui/toast/toast-config";
import {
  CARD_SUB_CATEGORY_ICONS,
  ELECTRONICS_SUB_CATEGORY_ICONS,
  PERSONAL_BELONGING_SUB_CATEGORY_ICONS,
} from "@/src/shared/constants";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Asset } from "expo-asset";
import * as Notifications from "expo-notifications";
import {
  ExternalPathString,
  RelativePathString,
  router,
  Stack,
} from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-get-random-values";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { usePostSubcategoryStore } from "../features/post/store";
import { AppSplashScreen } from "../shared/components";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
    },
  },
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function RootLayout() {
  const [isInitializing, setIsInitializing] = useState(true);
  const isLoaded = usePostSubcategoryStore((state) => state.isLoaded);
  const loadAllSubcategories = usePostSubcategoryStore(
    (state) => state.loadAllSubcategories,
  );

  // Handle notification when app is opened from a killed state
  useEffect(() => {
    function redirect(notification: Notifications.Notification) {
      const url = notification.request.content.data?.screenPath;
      router.push(url as RelativePathString | ExternalPathString);
    }

    const response = Notifications.getLastNotificationResponse();
    if (response?.notification) {
      redirect(response.notification);
    }

    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        redirect(response.notification);
      },
    );

    return () => {
      subscription.remove();
    };
  }, []);

  // Preload icons
  useEffect(() => {
    async function preloadImages() {
      try {
        setIsInitializing(true);

        const images = [
          ...Object.values(CARD_SUB_CATEGORY_ICONS),
          ...Object.values(ELECTRONICS_SUB_CATEGORY_ICONS),
          ...Object.values(PERSONAL_BELONGING_SUB_CATEGORY_ICONS),
        ];

        const cacheImages = images.map((image) =>
          Asset.fromModule(image).downloadAsync(),
        );

        await Promise.all(cacheImages);
      } catch (e) {
        console.warn("Preload failed", e);
      } finally {
        setIsInitializing(false);
      }
    }

    preloadImages();
    loadAllSubcategories();
  }, []);

  if (isInitializing || !isLoaded) return <AppSplashScreen />;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <AuthProvider>
            <AppUserProvider>
              <BottomSheetModalProvider>
                <StatusBar style="auto" />

                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="(tabs)" />
                  <Stack.Screen
                    name="(auth)"
                    options={{
                      presentation: "modal",
                      animation: "slide_from_bottom",
                    }}
                  />
                  <Stack.Screen
                    name="(shared)"
                    options={{
                      presentation: "modal",
                      animation: "slide_from_bottom",
                    }}
                  />
                </Stack>

                <Toast config={toastConfig} position="top" topOffset={56} />
              </BottomSheetModalProvider>
            </AppUserProvider>
          </AuthProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
