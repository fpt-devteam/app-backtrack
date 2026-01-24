import type {
  GetNotificationsRequest,
  GetNotificationsResponse,
  SyncExpoPushTokenRequest,
  UpdateArchiveStatusRequest,
  UpdateReadStatusRequest,
} from "@/src/features/notification/types";
import { privateClient } from "@/src/shared/api";

// Backend endpoints from Backtrack.Notification/src/routes/notification.route.ts and device.route.ts
const NOTIFICATION_API = {
  list: "/api/notification/notifications",
  updateRead: "/api/notification/notifications/read",
  updateArchive: "/api/notification/notifications/archive",
  registerDevice: "/api/notification/devices/register",
} as const;

/**
 * Update read/unread status for selected notifications
 * Backend: PUT /api/notification/notifications/read
 * Payload: { notificationIds: string[], isRead: boolean }
 */
export async function updateReadStatus(
  req: UpdateReadStatusRequest,
): Promise<void> {
  await privateClient.put(NOTIFICATION_API.updateRead, req);
}

/**
 * Update archive/unarchive status for selected notifications
 * Backend: PUT /api/notification/notifications/archive
 * Payload: { notificationIds: string[], isArchived: boolean }
 */
export async function updateArchiveStatus(
  req: UpdateArchiveStatusRequest,
): Promise<void> {
  await privateClient.put(NOTIFICATION_API.updateArchive, req);
}

/**
 * Sync Expo push token with backend device registration
 * Backend: POST /api/notification/devices/register
 * Payload: { token: string, platform: 'ios' | 'android', deviceId: string }
 */
export async function syncExpoPushToken(
  req: SyncExpoPushTokenRequest,
): Promise<void> {
  await privateClient.post(NOTIFICATION_API.registerDevice, req);
}

/**
 * Get notifications with cursor-based pagination
 * Backend: GET /api/notification/notifications
 * Query params: cursor, limit, channel, status, isRead, isArchived
 * Response: ApiResponse<{ items: NotificationItem[], hasMore: boolean, nextCursor: string | null }>
 */
export async function getNotifications(
  req: GetNotificationsRequest,
): Promise<GetNotificationsResponse> {
  const response = await privateClient.get<GetNotificationsResponse>(
    NOTIFICATION_API.list,
    {
      params: req,
    },
  );
  return response.data;
}
