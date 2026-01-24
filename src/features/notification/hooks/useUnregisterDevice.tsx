import { unregisterDeviceApi } from "@/src/features/notification/api/device.api";
import {
  ExpoTokenValue,
  StorageKey,
  UpdatePushTokenRequest,
} from "@/src/features/notification/types";
import { createAsyncStorageKey } from "@/src/features/notification/utils";
import { useMutation } from "@tanstack/react-query";

const storage = createAsyncStorageKey<typeof StorageKey, ExpoTokenValue>(
  StorageKey,
);

export const useUnregisterDeviceMutation = () => {
  return useMutation({
    mutationKey: ["device", "unregister"],
    mutationFn: async () => {
      const saved = await storage.get();
      if (!saved) return;

      const req: UpdatePushTokenRequest = {
        token: saved.token,
        deviceId: saved.deviceId,
      };

      await unregisterDeviceApi(req);
      await storage.remove();
    },
  });
};
