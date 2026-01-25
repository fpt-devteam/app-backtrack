import {
  NotificationSendRequest,
  NotificationsFilterRequest,
  NotificationsFilterResponse,
  NotificationStatusUpdateRequest,
} from "@/src/features/notification/types";
import { privateClient } from "@/src/shared/api";

const NOTIFICATION_API = {
  FILTER: "/api/notification",
  UPDATE_STATUS: "/api/notification",
  SEND: "/api/notification",
} as const;

export const filterNotificationsApi = async (
  params: NotificationsFilterRequest,
) => {
  const result = await privateClient.get(NOTIFICATION_API.FILTER, { params });
  return result.data as NotificationsFilterResponse;
};

export const updateStatusNotifications = async (
  req: NotificationStatusUpdateRequest,
) => {
  await privateClient.put(NOTIFICATION_API.UPDATE_STATUS, req);
};

export const sendNotificationApi = async (req: NotificationSendRequest) => {
  await privateClient.post(NOTIFICATION_API.SEND, req);
};
