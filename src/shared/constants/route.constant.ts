import { ExternalPathString, RelativePathString } from "@/.expo/types/router";

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
  index: "/qr" as ExternalPathString | RelativePathString,
  purchase: "/qr/purchase" as ExternalPathString | RelativePathString,
  profile: "/qr/qr-profile" as ExternalPathString | RelativePathString,
  customize: "/qr/qr-customize" as ExternalPathString | RelativePathString,
  profileSetting: "/qr/qr-profile-setting" as ExternalPathString | RelativePathString,
} as const;

export const MAP_ROUTE = {
  index: "/(protected)/map",
  search: "/(protected)/map/search",
} as const;


export const SHARED_ROUTE = {
  notAvailable: "/shared/not-available",
} as const;