import {
  NotificationSendRequest,
  NotificationsFilterRequest,
  NotificationsFilterResponse,
  NotificationStatusUpdateRequest,
  UnreadCountResponse,
} from "@/src/features/notification/types";
import { privateClient } from "@/src/shared/api";

const NOTIFICATION_API = {
  FILTER: "/api/notification",
  UPDATE_STATUS: "/api/notification",
  SEND: "/api/notification",
  UNREAD_COUNT: "/api/notification/unread-count",
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

export const getUnreadCountApi = async () => {
  const result = await privateClient.get(NOTIFICATION_API.UNREAD_COUNT);
  return result.data as UnreadCountResponse;
};
