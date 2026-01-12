export const SOCKET_CONFIG = {
  DEV_URL: process.env.EXPO_PUBLIC_API_URL,
  PROD_URL: process.env.EXPO_PUBLIC_API_URL,
  PATH: "/api/chat/hub",
  TRANSPORTS: ["websocket", "polling"] as const,
  TIMEOUT: 5000,
  getServerUrl: () => {
    return __DEV__ ? SOCKET_CONFIG.DEV_URL : SOCKET_CONFIG.PROD_URL;
  },
} as const;
