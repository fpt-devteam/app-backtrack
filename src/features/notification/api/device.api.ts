import { PushTokenDeviceUpdateRequest } from "@/src/features/notification/types";
import { privateClient } from "@/src/shared/api";

const DEVICE_API = {
  SYNC_DEVICE: "/api/core/devices/register",
  UNSYNC_DEVICE: "/api/core/devices/unregister",
} as const;

export const registerDeviceApi = async (req: PushTokenDeviceUpdateRequest) => {
  await privateClient.post(DEVICE_API.SYNC_DEVICE, req);
};

export const unregisterDeviceApi = async (
  req: PushTokenDeviceUpdateRequest,
) => {
  await privateClient.post(DEVICE_API.UNSYNC_DEVICE, req);
};
