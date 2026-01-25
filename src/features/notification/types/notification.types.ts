import type {
  ApiResponse,
  CursorPaginationParams,
  CursorScrollResponse,
} from "@/src/shared/api";

/*
 * ENUMS & TYPES
 */
export const StorageKey = "bt:expoToken";
export type ExpoTokenValue = { token: string; deviceId: string };

export const NOTIFICATION_STATUS = {
  Unread: "Unread",
  Read: "Read",
  Archived: "Archived",
} as const;

export type NotificationStatus =
  (typeof NOTIFICATION_STATUS)[keyof typeof NOTIFICATION_STATUS];

export const NOTIFICATION_EVENT = {
  ChatEvent: "ChatEvent",
} as const;

export type NotificationEvent =
  (typeof NOTIFICATION_EVENT)[keyof typeof NOTIFICATION_EVENT];

/**
 * MODELS
 */
export type UserNotification = {
  id: string;
  userId: string;
  type: NotificationEvent;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  status: NotificationStatus;
  sentAt: Date;
};

/**
 * REQUESTS
 */
export type NotificationsFilterRequest = {
  status?: NotificationStatus;
} & CursorPaginationParams;

export type NotificationStatusUpdateRequest = {
  notificationIds: string[];
  status: NotificationStatus;
};

export type PushTokenDeviceUpdateRequest = {
  token: string;
  deviceId: string;
};

export type NotificationSendRequest = {
  target: {
    userId: string;
  };
  source: {
    name: string;
    eventId: string;
  };
  title: string;
  body: string;
  type: NotificationEvent;
  data?: {
    screenPath?: string;
    imageUrl?: string;
  };
};

/*
 * RESPONSES
 */
export type NotificationsFilterResponse = ApiResponse<
  CursorScrollResponse<UserNotification>
>;

export type UnreadCountResult = {
  count: number;
};

export type UnreadCountResponse = ApiResponse<UnreadCountResult>;
