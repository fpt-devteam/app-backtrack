import "@/global.css";
import { AppUserProvider, AuthProvider } from "@/src/features/auth/providers";
import { usePostSubcategoryStore } from "@/src/features/post/store";
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
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-get-random-values";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { FALLBACK_AVATAR_SOURCE } from "../shared/data";

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

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const loadAllSubcategories = usePostSubcategoryStore(
    (state) => state.loadAllSubcategories,
  );

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

  useEffect(() => {
    async function prepareApp() {
      try {
        const images = [
          ...Object.values(CARD_SUB_CATEGORY_ICONS),
          ...Object.values(ELECTRONICS_SUB_CATEGORY_ICONS),
          ...Object.values(PERSONAL_BELONGING_SUB_CATEGORY_ICONS),
        ];

        const cacheImagePromises = images.map((image) =>
          Asset.fromModule(image).downloadAsync(),
        );

        await Promise.all([
          ...cacheImagePromises,
          Asset.loadAsync(FALLBACK_AVATAR_SOURCE),

          loadAllSubcategories(),
        ]);
      } catch (e) {
        console.warn("Preload failed", e);
      } finally {
        await SplashScreen.hideAsync();
      }
    }

    prepareApp();
  }, []);

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

                  <Stack.Screen name="(shared)" />

                  <Stack.Screen
                    name="(post-create)"
                    options={{
                      headerShown: false,
                      animation: "slide_from_bottom",
                    }}
                  />

                  <Stack.Screen
                    name="(post)"
                    options={{
                      headerShown: false,
                      animation: "fade_from_bottom",
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
