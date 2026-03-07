import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";

const NOTIFICATION_SOCKET_CONFIG = {
  DEV_URL: process.env.EXPO_PUBLIC_API_URL,
  PROD_URL: process.env.EXPO_PUBLIC_API_URL,
  PATH: "/api/notification/hub",
  TRANSPORTS: ["websocket", "polling"] as const,
  TIMEOUT: 5000,
  EVENTS: {
    RECEIVE_NOTIFICATION: "receive_notification",
  },
  getServerUrl: () => {
    if (__DEV__) {
      if (!NOTIFICATION_SOCKET_CONFIG.DEV_URL) {
        console.warn("DEV_URL is not defined in environment variables");
        return "";
      }
      return NOTIFICATION_SOCKET_CONFIG.DEV_URL;
    }
    else {
      if (!NOTIFICATION_SOCKET_CONFIG.PROD_URL) {
        console.warn("PROD_URL is not defined in environment variables");
        return "";
      }
      return NOTIFICATION_SOCKET_CONFIG.PROD_URL;
    }
  },
} as const;

export class NotificationSocketService {
  private socket: Socket | null = null;
  private readonly serverUrl: string;

  constructor() {
    this.serverUrl = NOTIFICATION_SOCKET_CONFIG.getServerUrl();
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve();
        return;
      }

      this.socket = io(this.serverUrl, {
        path: NOTIFICATION_SOCKET_CONFIG.PATH,
        transports: [...NOTIFICATION_SOCKET_CONFIG.TRANSPORTS],
        timeout: NOTIFICATION_SOCKET_CONFIG.TIMEOUT,
      });

      this.socket.on("connect", () => {
        console.log("✅ Socket connected:", this.socket?.id);
        resolve();
      });

      this.socket.on("connect_error", (error) => {
        console.error("❌ Socket connection error:", error);
        reject(error);
      });

      this.socket.on("disconnect", (reason) => {
        console.log("🔌 Socket disconnected:", reason);
      });
    });
  }

  disconnect() {
    if (!this.socket?.connected) {
      console.warn("Notification Socket not connected, cannot disconnect");
      return;
    }

    this.socket.disconnect();
    this.socket = null;
  }

  onReceiveNotification(callback: (unreadCount: number) => void) {
    if (!this.socket) {
      console.warn("Notification Socket not initialized");
      return () => { };
    }

    this.socket.on(NOTIFICATION_SOCKET_CONFIG.EVENTS.RECEIVE_NOTIFICATION, callback);

    return () => {
      this.socket?.off(NOTIFICATION_SOCKET_CONFIG.EVENTS.RECEIVE_NOTIFICATION, callback);
    };
  }
}

export const notificationSocketService = new NotificationSocketService();
