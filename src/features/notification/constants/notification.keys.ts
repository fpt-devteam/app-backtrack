import type { GetNotificationsRequest } from "@/src/features/notification/types";

export const NOTIFICATION_QUERY_KEY = ["notifications"] as const;

export const notificationKeys = {
  all: [...NOTIFICATION_QUERY_KEY] as const,
  lists: () => [...notificationKeys.all, "list"] as const,
  list: (filters: GetNotificationsRequest) =>
    [...notificationKeys.lists(), filters] as const,
};
