import {
  NOTIFICATION_EVENT,
  NOTIFICATION_STATUS,
  type UserNotification,
} from "@/src/features/notification/types";

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
      screenPath: "/(tabs)/chat/conversations/chat-42",
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
      screenPath: "/handover/verify/match-88",
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
      screenPath: "/(tabs)/map",
    },
  },
  {
    id: "mock-5",
    userId: "mock-user",
    type: NOTIFICATION_EVENT.HandoverRequest,
    title: "Handover Request",
    body: "Sarah is ready to return your 'Keys with Teddy Keychain'. Check proposed meeting time.",
    status: NOTIFICATION_STATUS.Unread,
    sentAt: new Date(Date.now() - 12 * 60 * 1000), // 12 mins ago
    data: {
      senderName: "Sarah",
      itemName: "Keys with Teddy Keychain",
      handoverId: "ho-99",
      screenPath: "/handover/ho-99",
    }
  },
  {
    id: "mock-6",
    userId: "mock-user",
    type: NOTIFICATION_EVENT.HandoverAccepted,
    title: "Meeting Confirmed!",
    body: "Great! Mike accepted the handover for 'MacBook Air'. You're all set to meet up.",
    status: NOTIFICATION_STATUS.Unread,
    sentAt: new Date(Date.now() - 3 * 86400 * 1000), // 3 days ago
    data: {
      partnerName: "Mike",
      itemName: "MacBook Air",
      screenPath: "/handover/history/ho-66",
    }
  },
  {
    id: "mock-7",
    userId: "mock-user",
    type: NOTIFICATION_EVENT.HandoverRejected,
    title: "Handover Update",
    body: "Tom declined the handover for 'Student Card'. Reason: Item already returned to Security Office.",
    status: NOTIFICATION_STATUS.Unread,
    sentAt: new Date(Date.now() - 5 * 86400 * 1000), // 5 days ago
    data: {
      itemName: "Student Card",
      reason: "Returned to office",
      screenPath: "/handover/history/ho-66",
    }
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
      screenPath: "/system/alert",
    }
  },
];
