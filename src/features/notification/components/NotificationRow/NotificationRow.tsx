import type { UserNotification } from "@/src/features/notification/types";
import { NOTIFICATION_EVENT } from "@/src/features/notification/types";
import React from "react";
import {
  AIMatchingNotificationRow,
  ChatEventNotificationRow,
  HandoverAcceptNotificationRow,
  HandoverRejectNotificationRow,
  HandoverRequestNotificationRow,
  QRScanNotificationRow,
  SystemAlertNotificationRow,
} from "./variants";

type NotificationRowProps = {
  notification: UserNotification;
  onPress: (notification: UserNotification) => void;
};

export const NotificationRow = ({
  notification,
  onPress,
}: NotificationRowProps) => {
  switch (notification.type) {
    case NOTIFICATION_EVENT.ChatEvent:
      return (
        <ChatEventNotificationRow
          notification={notification}
          onPress={onPress}
        />
      );
    case NOTIFICATION_EVENT.AIMatchingEvent:
      return (
        <AIMatchingNotificationRow
          notification={notification}
          onPress={onPress}
        />
      );
    case NOTIFICATION_EVENT.QRScanEvent:
      return (
        <QRScanNotificationRow notification={notification} onPress={onPress} />
      );
    case NOTIFICATION_EVENT.SystemAlertEvent:
      return (
        <SystemAlertNotificationRow
          notification={notification}
          onPress={onPress}
        />
      );
    case NOTIFICATION_EVENT.HandoverRequest:
      return (
        <HandoverRequestNotificationRow
          notification={notification}
          onPress={onPress}
        />
      );
    case NOTIFICATION_EVENT.HandoverAccepted:
      return (
        <HandoverAcceptNotificationRow
          notification={notification}
          onPress={onPress}
        />
      );
    case NOTIFICATION_EVENT.HandoverRejected:
      return (
        <HandoverRejectNotificationRow
          notification={notification}
          onPress={onPress}
        />
      );
    default:
      return null;
  }
};
