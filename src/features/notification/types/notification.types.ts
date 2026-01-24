import type { ApiResponse, CursorScrollResponse } from "@/src/shared/api";

// Enums matching backend
export const NotificationChannel = {
  Push: "Push",
  InApp: "InApp",
  Email: "Email",
} as const;
export type NotificationChannelType =
  (typeof NotificationChannel)[keyof typeof NotificationChannel];

export const NotificationEvent = {
  ChatEvent: "ChatEvent",
} as const;
export type NotificationEventType =
  (typeof NotificationEvent)[keyof typeof NotificationEvent];

export const NotificationStatus = {
  Pending: "Pending",
  Sent: "Sent",
  Failed: "Failed",
} as const;
export type NotificationStatusType =
  (typeof NotificationStatus)[keyof typeof NotificationStatus];

// Notification item matching backend response
export type NotificationItem = {
  _id: string;
  userId: string;
  channel: NotificationChannelType;
  type: NotificationEventType;
  title: string | null;
  body: string | null;
  data: Record<string, unknown> | null;
  status: NotificationStatusType;
  sentAt: Date;
  isRead: boolean;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
};

// Request types matching backend contracts
export type UpdateReadStatusRequest = {
  notificationIds: string[];
  isRead: boolean;
};

export type UpdateArchiveStatusRequest = {
  notificationIds: string[];
  isArchived: boolean;
};

export type SyncExpoPushTokenRequest = {
  token: string;
  platform: "ios" | "android";
  deviceId: string;
};

export type GetNotificationsRequest = {
  cursor?: string;
  limit?: number;
  channel?: NotificationChannelType;
  status?: NotificationStatusType;
  isRead?: boolean;
  isArchived?: boolean;
};

// Response types
export type GetNotificationsResponse = ApiResponse<
  CursorScrollResponse<NotificationItem>
>;
