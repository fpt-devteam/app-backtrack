import { ExternalPathString, RelativePathString } from "@/.expo/types/router";

type RoutePath = ExternalPathString | RelativePathString;
const createPath = <T extends string>(path: T): RoutePath => path as RoutePath;

const POST_BASE = `(tabs)/post` as const;
const CHAT_BASE = `(tabs)/chat` as const;
const QR_BASE = `(tabs)/profile/qr` as const;
const HANDOVER_BASE = `(tabs)/handover` as const;
const AUTH_BASE = `(auth)` as const;

export const PROFILE_ROUTE = {
  index: `/(tabs)/profile` as ExternalPathString | RelativePathString,
  other: (userId: string) => `/(tabs)/profile/${userId}` as ExternalPathString | RelativePathString,
  detail: `/(tabs)/profile/detail` as ExternalPathString | RelativePathString,
  edit: `/(tabs)/profile/edit` as ExternalPathString | RelativePathString,
  password: `/(tabs)/profile/password` as ExternalPathString | RelativePathString,
  menuTab: `/(tabs)/profile/menu-tab` as ExternalPathString | RelativePathString,
  userPosts: `/(tabs)/profile/user-posts` as ExternalPathString | RelativePathString,
  userPostDetail: (postId: string) => `/(tabs)/profile/user-posts/${postId}` as ExternalPathString | RelativePathString,
  detailMatch: (postId: string, otherPostId: string) =>
    `/(tabs)/profile/user-posts/${postId}/${otherPostId}` as ExternalPathString | RelativePathString,

  userPostDetailEdit: (postId: string) => `/(tabs)/profile/user-posts/${postId}/edit` as ExternalPathString | RelativePathString,
  handoverRequest: (postId: string, otherPostId: string) => `/(tabs)/profile/user-posts/${postId}/${otherPostId}/handover-request` as ExternalPathString | RelativePathString,
} as const;

export const POST_ROUTE = {
  index: createPath(POST_BASE),
  create: createPath(`${POST_BASE}/create`),
  detail: (p: string) => createPath(`${POST_BASE}/${p}`),

  stepper: createPath(`${POST_BASE}/create/stepper`),
  category: createPath(`${POST_BASE}/create/stepper/category`),
  subCategory: createPath(`${POST_BASE}/create/stepper/sub-category`),
  identity: createPath(`${POST_BASE}/create/stepper/identity`),
  location: createPath(`${POST_BASE}/create/stepper/location`),
  timeline: createPath(`${POST_BASE}/create/stepper/timeline`),
  itemDetail: createPath(`${POST_BASE}/create/stepper/detail`),

  matching: (p: string) => createPath(`${POST_BASE}/create/${p}`),
  detailMatching: (p1: string, p2: string) => createPath(`${POST_BASE}/create/${p1}/${p2}`),
  detailMatch: (p1: string, p2: string) =>
    createPath(`${POST_BASE}/${p1}/compare/${p2}`),

  // 
  search: createPath(`${POST_BASE}/search`),
  searchFilter: createPath(`${POST_BASE}/search/filter`),
  searchResult: createPath(`${POST_BASE}/search/result`),
} as const;

export const CHAT_ROUTE = {
  index: createPath(CHAT_BASE),
  conversations: createPath(CHAT_BASE),
  message: (id: string) => createPath(`${CHAT_BASE}/${id}`),
  information: (id: string) => createPath(`${CHAT_BASE}/${id}/information`),
} as const;

export const QR_ROUTE = {
  index: createPath(QR_BASE),
  purchase: createPath(`${QR_BASE}/purchase`),
  profile: createPath(`${QR_BASE}/qr-profile`),
  profileSetting: createPath(`${QR_BASE}/qr-profile-setting`),
} as const;

export const HANDOVER_ROUTE = {
  index: createPath(HANDOVER_BASE),
  detail: (handoverId: string) =>
    createPath(`${HANDOVER_BASE}/${handoverId}`),
  all: (filter: `ongoing` | `past`) =>
    createPath(`${HANDOVER_BASE}/all?filter=${filter}`),
} as const;

export const AUTH_ROUTE = {
  onboarding: createPath(`${AUTH_BASE}/onboarding`),
  register: createPath(`${AUTH_BASE}/register`),
  verifyEmail: createPath(`${AUTH_BASE}/verify-email`),
  login: createPath(`${AUTH_BASE}/login`),
  passwordReset: createPath(`${AUTH_BASE}/password-reset`),
  verifyPhone: createPath(`${AUTH_BASE}/verify-phone`),
  verifyPhoneInput: createPath(`${AUTH_BASE}/verify-phone-input`),
} as const;