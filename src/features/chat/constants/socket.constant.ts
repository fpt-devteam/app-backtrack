export const SOCKET_CONFIG = {
  DEV_URL: process.env.EXPO_PUBLIC_API_URL,
  PROD_URL: process.env.EXPO_PUBLIC_API_URL,
  PATH: "/chat/hub",
  TRANSPORTS: ["polling", "websocket"] as const,
  TIMEOUT: 10000,
  getServerUrl: () => {
    return __DEV__ ? SOCKET_CONFIG.DEV_URL : SOCKET_CONFIG.PROD_URL;
  },
} as const;
