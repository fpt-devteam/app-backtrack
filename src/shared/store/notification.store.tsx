import { registerForPushNotificationsAsync } from "@/src/shared/utils/notification.utils";
import * as Notifications from "expo-notifications";
import React, {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

interface NotificationContextType {
  expoPushToken: string | null;
  notification: Notifications.Notification | null;
  lastResponse: Notifications.NotificationResponse | null;
  error: Error | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error(
      "useNotification must be used within a NotificationProvider",
    );
  }
  return ctx;
};

interface NotificationProviderProps {
  children: ReactNode;
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);
  const [lastResponse, setLastResponse] =
    useState<Notifications.NotificationResponse | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const notificationSub = useRef<Notifications.EventSubscription | null>(null);
  const responseSub = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const token = await registerForPushNotificationsAsync();
        if (mounted) setExpoPushToken(token ?? null);
      } catch (e) {
        if (mounted) setError(e as Error);
      }

      // App opened from a notification (cold start)
      const initialResponse =
        await Notifications.getLastNotificationResponseAsync();
      if (mounted && initialResponse) {
        setLastResponse(initialResponse);
      }
    })();

    notificationSub.current = Notifications.addNotificationReceivedListener(
      (n) => {
        console.log("🔔 Notification Received:", n);
        setNotification(n);
      },
    );

    responseSub.current = Notifications.addNotificationResponseReceivedListener(
      (res) => {
        const data = res.notification.request.content.data;
        console.log("🔔 Notification Response:", res);
        console.log("📦 Notification Data:", data);
        setLastResponse(res);
        // TODO: route based on `data` (expo-router)
      },
    );

    return () => {
      mounted = false;
      notificationSub.current?.remove();
      responseSub.current?.remove();
      notificationSub.current = null;
      responseSub.current = null;
    };
  }, []);

  const value = useMemo(
    () => ({ expoPushToken, notification, lastResponse, error }),
    [expoPushToken, notification, lastResponse, error],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
