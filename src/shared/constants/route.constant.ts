import { ExternalPathString, RelativePathString } from "@/.expo/types/router";

type RoutePath = ExternalPathString | RelativePathString;
const createPath = <T extends string>(path: T): RoutePath => path as RoutePath;

const TAB = "/(tabs)" as const;
const POST_BASE = `${TAB}/post` as const;
const CHAT_BASE = `${TAB}/chat/conversations` as const;
const QR_BASE = "/qr" as const;
const HANDOVER_BASE = `${TAB}/handover` as const;

export const PROFILE_ROUTE = {
  index: "/(tabs)/profile" as ExternalPathString | RelativePathString,
  other: (userId: string) => `/(tabs)/profile/${userId}` as ExternalPathString | RelativePathString,
  detail: "/(tabs)/profile/detail" as ExternalPathString | RelativePathString,
  edit: "/(tabs)/profile/edit" as ExternalPathString | RelativePathString,
  setting: "/(tabs)/profile/setting" as ExternalPathString | RelativePathString,
  menuTab: "/(tabs)/profile/menu-tab" as ExternalPathString | RelativePathString,
  userPosts: "/(tabs)/profile/user-posts" as ExternalPathString | RelativePathString,
} as const;

export const POST_ROUTE = {
  index: "/(tabs)/post" as ExternalPathString | RelativePathString,
  create: "/(tabs)/post/create" as ExternalPathString | RelativePathString,
  createOptions: "/(tabs)/post/create-options" as ExternalPathString | RelativePathString,
  details: (postId: string) => `/(tabs)/post/${postId}` as ExternalPathString | RelativePathString,
  handoverRequest: (postId: string) => `/(tabs)/post/${postId}/handover-request` as ExternalPathString | RelativePathString,
  matching: (postId: string) => `/(tabs)/post/${postId}/matching` as ExternalPathString | RelativePathString,
  detailMatch: (postId: string, otherPostId: string) =>
    `/(tabs)/post/${postId}/compare/${otherPostId}` as ExternalPathString | RelativePathString,
  search: "/(tabs)/post/search" as ExternalPathString | RelativePathString,
  searchFilter: "/(tabs)/post/search/filter" as ExternalPathString | RelativePathString,
  searchLocationInput: "/(tabs)/post/search/location-search" as ExternalPathString | RelativePathString,
  searchLocation: "/(tabs)/post/search/location" as ExternalPathString | RelativePathString,
  searchResult: "/(tabs)/post/search/result" as ExternalPathString | RelativePathString,
} as const;

export const CHAT_ROUTE = {
  conversations: createPath(CHAT_BASE),
  message: (id: string) => createPath(`${CHAT_BASE}/${id}`),
  information: (id: string) => createPath(`${CHAT_BASE}/${id}/information`),
} as const;

export const QR_ROUTE = {
  index: createPath(QR_BASE),
  purchase: createPath(`${QR_BASE}/purchase`),
  profile: createPath(`${QR_BASE}/qr-profile`),
  customize: createPath(`${QR_BASE}/qr-customize`),
  profileSetting: createPath(`${QR_BASE}/qr-profile-setting`),
} as const;

export const HANDOVER_ROUTE = {
  index: `${HANDOVER_BASE}` as ExternalPathString | RelativePathString,
  detail: (handoverId: string) =>
    `${HANDOVER_BASE}/${handoverId}` as ExternalPathString | RelativePathString,
} as const;

export const MAP_ROUTE = {
  index: "/(tabs)/map" as ExternalPathString | RelativePathString,
  search: "/(tabs)/map/search" as ExternalPathString | RelativePathString,
} as const;

export const SHARED_ROUTE = {
  notAvailable: "/shared/not-available" as ExternalPathString | RelativePathString,
} as const;

export const AUTH_ROUTE = {
  onboarding: "/(auth)" as ExternalPathString | RelativePathString,
  register: "/(auth)/register" as ExternalPathString | RelativePathString,
  verifyEmail: "/(auth)/verify-email" as ExternalPathString | RelativePathString,
  login: "/(auth)/login" as ExternalPathString | RelativePathString,
  passwordReset: "/(auth)/password-reset" as ExternalPathString | RelativePathString,
} as const;