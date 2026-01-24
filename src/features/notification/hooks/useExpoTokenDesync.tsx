import { desyncExpoPushToken } from "@/src/features/notification/api";
import type { DesyncExpoPushTokenRequest } from "@/src/features/notification/types";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useCallback } from "react";

export const useExpoTokenDesync = () => {
  const desync = useCallback(async (): Promise<void> => {
    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;
      if (!projectId) {
        console.error("Project ID not found");
        return;
      }

      const token = (await Notifications.getExpoPushTokenAsync({ projectId }))
        .data;
      const deviceId = Device.modelId || "unknown";
      const request: DesyncExpoPushTokenRequest = { token, deviceId };
      await desyncExpoPushToken(request);
    } catch (error) {
      console.error("Failed to desync push token:", error);
      throw error;
    }
  }, []);

  return { desync };
};
