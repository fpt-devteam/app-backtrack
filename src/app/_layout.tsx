import "@/global.css";
import { AppUserProvider, AuthProvider } from "@/src/features/auth/providers";
import { toastConfig } from "@/src/shared/components/ui/toast/toast-config";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Notifications from "expo-notifications";
import {
  ExternalPathString,
  RelativePathString,
  router,
  Stack,
} from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-get-random-values";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

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
  useEffect(() => {
    function redirect(notification: Notifications.Notification) {
      const url = notification.request.content.data?.screenPath;
      console.log("Url: ", url);
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
