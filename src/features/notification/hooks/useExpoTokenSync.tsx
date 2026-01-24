import { syncExpoPushToken } from "@/src/features/notification/api";
import type { SyncExpoPushTokenRequest } from "@/src/features/notification/types";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useCallback, useState } from "react";
import { Platform } from "react-native";

/**
 * Hook to sync Expo push token with backend
 * - Requests notification permissions
 * - Gets Expo push token
 * - Sends to backend via device registration API
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
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();

      let finalStatus = existingStatus;
      if (existingStatus !== Notifications.PermissionStatus.GRANTED) {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== Notifications.PermissionStatus.GRANTED) {
        console.warn("Permission not granted for push notifications");
        setIsSyncing(false);
        return;
      }

      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;

      if (!projectId) {
        console.error("Project ID not found");
        setIsSyncing(false);
        return;
      }

      const token = (await Notifications.getExpoPushTokenAsync({ projectId }))
        .data;
      const deviceId = Device.modelId || "unknown";
      const platform = Platform.OS === "ios" ? "ios" : "android";
      const request: SyncExpoPushTokenRequest = { token, platform, deviceId };
      await syncExpoPushToken(request);
    } catch (error) {
      console.error("Failed to sync push token:", error);
      throw error;
    } finally {
      setIsSyncing(false);
    }
  }, []);

  return { sync, isSyncing };
};
