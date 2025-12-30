export const SOCKET_CONFIG = {
  DEV_URL: 'http://localhost:3000',
  PROD_URL: 'http://localhost:3000',
  PATH: '/hub',
  TRANSPORTS: ['websocket', 'polling'] as const,
  TIMEOUT: 5000,
  getServerUrl: () => {
    return __DEV__ ? SOCKET_CONFIG.DEV_URL : SOCKET_CONFIG.PROD_URL;
  },
} as const;
