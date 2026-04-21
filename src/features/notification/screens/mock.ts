import {
  NOTIFICATION_EVENT,
  NOTIFICATION_STATUS,
  type UserNotification,
} from "@/src/features/notification/types";
import {
  CHAT_ROUTE,
  HANDOVER_ROUTE,
  MAP_ROUTE,
  POST_ROUTE,
  SHARED_ROUTE,
} from "@/src/shared/constants";

export const IS_NOTIFICATIONS_MOCK = true;

export const MOCK_NOTIFICATIONS: UserNotification[] = [
  {
    id: "mock-1",
    userId: "mock-user",
    type: NOTIFICATION_EVENT.ChatEvent,
    title: "New message",
    body: "Alex sent you a message about the phone you reported.",
    status: NOTIFICATION_STATUS.Unread,
    sentAt: new Date(Date.now() - 8 * 60 * 1000),
    data: {
      screenPath: CHAT_ROUTE.conversations,
    },
  },
  {
    id: "mock-2",
    userId: "mock-user",
    type: NOTIFICATION_EVENT.AIMatchingEvent,
    title: "AI Match Found (96%)",
    body: "Excellent! We found a high-confidence match for your lost 'Sony Headphones'. Tap to verify details.",
    status: NOTIFICATION_STATUS.Unread,
    sentAt: new Date(Date.now() - 28 * 60 * 1000), // 28 mins ago
    data: {
      itemName: "Sony Headphones",
      matchScore: 96,
      matchId: "match-88",
      screenPath: POST_ROUTE.index,
    }
  },
  {
    id: "mock-3",
    userId: "mock-user",
    type: NOTIFICATION_EVENT.QRScanEvent,
    title: "Item Location Spotted",
    body: "The QR code on your 'Blue Backpack' was just scanned at F-Town 3 Lobby. View on map?",
    status: NOTIFICATION_STATUS.Unread,
    sentAt: new Date(Date.now() - 2 * 3600 * 1000), // 2 hours ago
    data: {
      itemName: "Blue Backpack",
      location: { latitude: 10.8411, longitude: 106.8100 },
      displayAddress: "F-Town 3, Thu Duc City",
      screenPath: MAP_ROUTE.index,
    },
  },
  {
    id: "mock-5",
    userId: "mock-user",
    type: NOTIFICATION_EVENT.HandoverRequest,
    title: "Handover ready to review",
    body: "Sarah wants to return your 'Keys with Teddy Keychain'. Review the request and continue in the handover flow.",
    status: NOTIFICATION_STATUS.Unread,
    sentAt: new Date(Date.now() - 12 * 60 * 1000),
    data: {
      senderName: "Sarah",
      itemName: "Keys with Teddy Keychain",
      handoverId: "h-002-active-owner",
      screenPath: HANDOVER_ROUTE.detail("h-002-active-owner"),
    },
  },
  {
    id: "mock-6",
    userId: "mock-user",
    type: NOTIFICATION_EVENT.HandoverAccepted,
    title: "Handover request accepted",
    body: "Mike accepted the handover for 'MacBook Air'. A draft handover is now ready for coordination.",
    status: NOTIFICATION_STATUS.Unread,
    sentAt: new Date(Date.now() - 3 * 86400 * 1000),
    data: {
      partnerName: "Mike",
      itemName: "MacBook Air",
      screenPath: HANDOVER_ROUTE.detail("h-001-draft-owner"),
    },
  },
  {
    id: "mock-7",
    userId: "mock-user",
    type: NOTIFICATION_EVENT.HandoverRejected,
    title: "Handover request declined",
    body: "Tom declined the handover for 'Student Card'. Review the update for the final status.",
    status: NOTIFICATION_STATUS.Unread,
    sentAt: new Date(Date.now() - 5 * 86400 * 1000),
    data: {
      itemName: "Student Card",
      reason: "Returned to office",
      screenPath: HANDOVER_ROUTE.detail("h-007-rejected"),
    },
  },
  {
    id: "mock-4",
    userId: "mock-user",
    type: NOTIFICATION_EVENT.SystemAlertEvent,
    title: "Backtrack Maintenance",
    body: "We're upgrading our AI thám tử! System will be down for 2h tonight starting 00:00 AM.",
    status: NOTIFICATION_STATUS.Unread,
    sentAt: new Date(Date.now() - 6 * 3600 * 1000), // 6 hours ago
    data: {
      screenPath: SHARED_ROUTE.notAvailable,
    }
  },
];
