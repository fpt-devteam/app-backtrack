import type {
  DesyncExpoPushTokenRequest,
  NotificationsFilterRequest,
  NotificationsFilterResponse,
  SyncExpoPushTokenRequest,
  UpdateArchiveStatusRequest,
  UpdateReadStatusRequest,
} from "@/src/features/notification/types";
import { privateClient } from "@/src/shared/api";

// Backend endpoints from Backtrack.Notification/src/routes/notification.route.ts and device.route.ts
const NOTIFICATION_API = {
  list: "/api/notification",
  updateRead: "/api/notification/read",
  updateArchive: "/api/notification/archive",
  registerDevice: "/api/notification/device/register",
  unregisterDevice: "/api/notification/device/unregister",
} as const;

/**
 * Update read/unread status for selected notifications
 * Backend: PUT /api/notification/read
 * Payload: { notificationIds: string[], isRead: boolean }
 */
export async function updateReadStatus(
  req: UpdateReadStatusRequest,
): Promise<void> {
  await privateClient.put(NOTIFICATION_API.updateRead, req);
}

/**
 * Update archive/unarchive status for selected notifications
 * Backend: PUT /api/notification/archive
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
export async function syncExpoPushToken(req: SyncExpoPushTokenRequest) {
  await privateClient.post(NOTIFICATION_API.registerDevice, req);
}

/**
 * Sync Expo push token with backend device registration
 * Backend: POST /api/notification/devices/register
 * Payload: { token: string, platform: 'ios' | 'android', deviceId: string }
 */
export async function desyncExpoPushToken(req: DesyncExpoPushTokenRequest) {
  await privateClient.post(NOTIFICATION_API.unregisterDevice, req);
}

/**
 * Get notifications with cursor-based pagination
 * Backend: GET /api/notification
 * Query params: cursor, limit, channel, status, isRead, isArchived
 * Response: ApiResponse<{ items: NotificationItem[], hasMore: boolean, nextCursor: string | null }>
 */
export async function filterNotifications(req: NotificationsFilterRequest) {
  const response = await privateClient.get<NotificationsFilterResponse>(
    NOTIFICATION_API.list,
    { params: req },
  );
  return response.data;
}
