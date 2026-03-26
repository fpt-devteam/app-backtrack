import { ExternalPathString, RelativePathString } from "@/.expo/types/router";

type RoutePath = ExternalPathString | RelativePathString;
const createPath = <T extends string>(path: T): RoutePath => path as RoutePath;

const PROTECTED = "/(protected)" as const;
const POST_BASE = `${PROTECTED}/posts` as const;
const CHAT_BASE = `${PROTECTED}/chat/conversations` as const;
const QR_BASE = "/qr" as const;

export const PROFILE_ROUTE = {
  index: "/(protected)/profile" as ExternalPathString | RelativePathString,
  other: (userId: string) => `/(protected)/profile/${userId}` as ExternalPathString | RelativePathString,
  edit: "/(protected)/profile/edit" as ExternalPathString | RelativePathString,
  setting: "/(protected)/profile/setting" as ExternalPathString | RelativePathString,
  menuTab: "/(protected)/profile/menu-tab" as ExternalPathString | RelativePathString,
} as const;

export const POST_ROUTE = {
  index: "/(protected)/(tabs)/posts" as ExternalPathString | RelativePathString,
  create: "/(protected)/posts/create" as ExternalPathString | RelativePathString,
  createOptions: "/(protected)/posts/create-options" as ExternalPathString | RelativePathString,
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
  conversations: createPath(CHAT_BASE),
  message: (id: string) => createPath(`${CHAT_BASE}/${id}`),
} as const;

export const QR_ROUTE = {
  index: createPath(QR_BASE),
  purchase: createPath(`${QR_BASE}/purchase`),
  profile: createPath(`${QR_BASE}/qr-profile`),
  customize: createPath(`${QR_BASE}/qr-customize`),
  profileSetting: createPath(`${QR_BASE}/qr-profile-setting`),
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