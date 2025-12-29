import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import 'react-native-get-random-values';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PaperProvider } from "react-native-paper";
import "../../global.css";
import { AuthProvider } from "../features/auth/providers";

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
    <AuthProvider>
      <PaperProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="auto" />
          <Stack screenOptions={{ headerShown: false }} >
            <Stack.Screen name="(protected)" />
            <Stack.Screen name="(public)" />
          </Stack>
        </QueryClientProvider>
      </PaperProvider>
    </AuthProvider>
  );
}
