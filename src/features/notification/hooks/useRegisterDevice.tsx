import { registerDeviceApi } from "@/src/features/notification/api/device.api";
import {
  ExpoTokenValue,
  PushTokenDeviceUpdateRequest,
  StorageKey,
} from "@/src/features/notification/types";
import { createAsyncStorageKey } from "@/src/features/notification/utils";
import { useMutation } from "@tanstack/react-query";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";

const storage = createAsyncStorageKey<typeof StorageKey, ExpoTokenValue>(
  StorageKey,
);

export const useRegisterDeviceMutation = () => {
  return useMutation({
    mutationKey: ["device", "register"],
    mutationFn: async () => {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;

      if (!projectId) {
        console.error("Project ID not found");
        return;
      }

      const token = (await Notifications.getExpoPushTokenAsync({ projectId }))
        .data;
      const deviceId = token;

      console.log("Obtained Expo push token:", token);

      const req: PushTokenDeviceUpdateRequest = {
        token,
        deviceId,
      };

      await registerDeviceApi(req);
      await storage.set({ token, deviceId });
    },
  });
};
