export const PROFILE_ROUTE = {
  index: "/(protected)/profile",
} as const;

export const POST_ROUTE = {
  index: "/(protected)/(tabs)/posts",
  create: "/(protected)/posts/create",
  details: (postId: string) => `/(protected)/posts/${postId}`,
  matching: (postId: string) => `/(protected)/posts/${postId}/matching`,
  detailMatch: (postId: string, otherPostId: string) =>
    `/(protected)/posts/${postId}/compare/${otherPostId}`,
  search: "/(protected)/posts/search",
  searchLocationInput: "/(protected)/posts/search/location-search",
  searchLocation: "/(protected)/posts/search/location",
  searchResult: "/(protected)/posts/search/result",
} as const;

export const CHAT_ROUTE = {
  conversations: `/(protected)/chat/conversations`,
  message: (conversationId: string) =>
    `/(protected)/chat/conversations/${conversationId}`,
} as const;

export const QR_ROUTE = {
  index: "/qr",
  generate: "/qr/generate",
  edit: (qrCodeId: string) => `/qr/${qrCodeId}/edit`,
  scan: "/qr/scan",
  purchase: "/qr/purchase",
  detail: (qrCodeId: string) => `/qr/${qrCodeId}`,
  qrView: (qrCodeId: string, publicCode: string) =>
    `/qr/${qrCodeId}/qr-view/${publicCode}`,
} as const;

export const MAP_ROUTE = {
  index: "/(protected)/map",
  search: "/(protected)/map/search",
} as const;


export const SHARED_ROUTE = {
  notAvailable: "/shared/not-available",
} as const;