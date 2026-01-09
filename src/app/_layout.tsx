import '@/global.css';
import { AuthProvider, UserProvider } from "@/src/features/auth/providers";
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-get-random-values';
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from 'react-native-safe-area-context';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <AuthProvider>
            <UserProvider>
              <PaperProvider>
                <BottomSheetModalProvider>
                  <StatusBar style="auto" />
                  <Stack screenOptions={{
                    headerShown: false,
                  }}>
                    <Stack.Screen name="(protected)" />
                    <Stack.Screen name="(public)" />
                  </Stack>
                </BottomSheetModalProvider>
              </PaperProvider>
            </UserProvider>
          </AuthProvider>
        </SafeAreaProvider>
      </QueryClientProvider >
    </GestureHandlerRootView>
  );
}
