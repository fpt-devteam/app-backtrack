import { ExternalPathString, RelativePathString } from "@/.expo/types/router";

export const PROFILE_ROUTE = {
  index: "/(protected)/profile" as ExternalPathString | RelativePathString,
  other: (userId: string) => `/(protected)/profile/${userId}` as ExternalPathString | RelativePathString,
} as const;

export const POST_ROUTE = {
  index: "/(protected)/(tabs)/posts" as ExternalPathString | RelativePathString,
  create: "/(protected)/posts/create" as ExternalPathString | RelativePathString,
  details: (postId: string) => `/(protected)/posts/${postId}` as ExternalPathString | RelativePathString,
  matching: (postId: string) => `/(protected)/posts/${postId}/matching` as ExternalPathString | RelativePathString,
  detailMatch: (postId: string, otherPostId: string) =>
    `/(protected)/posts/${postId}/compare/${otherPostId}` as ExternalPathString | RelativePathString,
  search: "/(protected)/posts/search" as ExternalPathString | RelativePathString,
  searchLocationInput: "/(protected)/posts/search/location-search" as ExternalPathString | RelativePathString,
  searchLocation: "/(protected)/posts/search/location" as ExternalPathString | RelativePathString,
  searchResult: "/(protected)/posts/search/result" as ExternalPathString | RelativePathString,
} as const;

export const CHAT_ROUTE = {
  conversations: `/(protected)/chat/conversations` as ExternalPathString | RelativePathString,
  message: (conversationId: string) =>
    `/(protected)/chat/conversations/${conversationId}` as ExternalPathString | RelativePathString,
} as const;

export const QR_ROUTE = {
  index: "/qr" as ExternalPathString | RelativePathString,
  purchase: "/qr/purchase" as ExternalPathString | RelativePathString,
  profile: "/qr/qr-profile" as ExternalPathString | RelativePathString,
  customize: "/qr/qr-customize" as ExternalPathString | RelativePathString,
  profileSetting: "/qr/qr-profile-setting" as ExternalPathString | RelativePathString,
} as const;

export const MAP_ROUTE = {
  index: "/(protected)/map" as ExternalPathString | RelativePathString,
  search: "/(protected)/map/search" as ExternalPathString | RelativePathString,
} as const;

export const NOTIFICATION_ROUTE = {
  index: "/(protected)/(tabs)/notification" as ExternalPathString | RelativePathString,
} as const;

export const SHARED_ROUTE = {
  notAvailable: "/shared/not-available" as ExternalPathString | RelativePathString,
} as const;