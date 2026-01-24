import { syncExpoPushToken } from "@/src/features/notification/api";
import type { SyncExpoPushTokenRequest } from "@/src/features/notification/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useCallback, useEffect, useState } from "react";
import { Platform } from "react-native";

const STORAGE_KEY = "expo_push_token";

/**
 * Hook to sync Expo push token with backend
 * - Requests notification permissions
 * - Gets Expo push token
 * - Sends to backend via device registration API
 * - Deduplicates: only syncs if token changed
 */
export const useExpoTokenSync = () => {
  const [isSyncing, setIsSyncing] = useState(false);

  const sync = useCallback(async (): Promise<void> => {
    if (!Device.isDevice) {
      console.warn("Must use physical device for push notifications");
      return;
    }

    setIsSyncing(true);

    try {
      // Set up Android notification channel
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }

      // Request permissions
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.warn("Permission not granted for push notifications");
        setIsSyncing(false);
        return;
      }

      // Get Expo push token
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;

      if (!projectId) {
        console.error("Project ID not found");
        setIsSyncing(false);
        return;
      }

      const pushTokenData = await Notifications.getExpoPushTokenAsync({
        projectId,
      });
      const pushToken = pushTokenData.data;

      // Check if token changed (deduplication)
      const storedToken = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedToken === pushToken) {
        console.log("Push token unchanged, skipping sync");
        setIsSyncing(false);
        return;
      }

      // Get device ID (using Constants.sessionId as fallback)
      const deviceId = Constants.sessionId || Device.modelId || "unknown";

      // Prepare request
      const request: SyncExpoPushTokenRequest = {
        token: pushToken,
        platform: Platform.OS === "ios" ? "ios" : "android",
        deviceId,
      };

      // Sync with backend
      await syncExpoPushToken(request);

      // Store token to prevent redundant syncs
      await AsyncStorage.setItem(STORAGE_KEY, pushToken);

      console.log("Push token synced successfully");
    } catch (error) {
      console.error("Failed to sync push token:", error);
      throw error;
    } finally {
      setIsSyncing(false);
    }
  }, []);

  return {
    sync,
    isSyncing,
  };
};

/**
 * Auto-sync on mount (useful for app startup)
 */
export const useAutoExpoTokenSync = (enabled = true) => {
  const { sync, isSyncing } = useExpoTokenSync();

  useEffect(() => {
    if (enabled) {
      sync().catch((error) => {
        console.error("Auto-sync failed:", error);
      });
    }
  }, [enabled, sync]);

  return { isSyncing };
};
