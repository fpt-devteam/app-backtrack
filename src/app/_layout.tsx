import '@/global.css';
import { AuthProvider, UserProvider } from "@/src/features/auth/providers";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
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
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <AuthProvider>
          <UserProvider>
            <PaperProvider>
              <StatusBar style="auto" />
              <Stack screenOptions={{
                headerShown: false,
              }}>
                <Stack.Screen name="(protected)" />
                <Stack.Screen name="(public)" />
              </Stack>
            </PaperProvider>
          </UserProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </QueryClientProvider >
  );
}
