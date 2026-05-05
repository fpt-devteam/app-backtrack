import { ExternalPathString, RelativePathString } from "@/.expo/types/router";

type RoutePath = ExternalPathString | RelativePathString;
const createPath = <T extends string>(path: T): RoutePath => path as RoutePath;


const AUTH_BASE = `(auth)` as const;
const PROFILE_BASE = `/(profile)` as const;
const QR_BASE = `/(qr)` as const;
const CHAT_BASE = `/(chat)` as const;
const HANDOVER_BASE = `/(handover)` as const;
const POST_BASE = `/(post)` as const;

export const AUTH_ROUTE = {
  onboarding: createPath(`${AUTH_BASE}/onboarding`),
  register: createPath(`${AUTH_BASE}/register`),
  verifyEmail: createPath(`${AUTH_BASE}/verify-email`),
  login: createPath(`${AUTH_BASE}/login`),
  passwordReset: createPath(`${AUTH_BASE}/password-reset`),
  verifyPhone: createPath(`${AUTH_BASE}/verify-phone`),
  verifyPhoneInput: createPath(`${AUTH_BASE}/verify-phone-input`),
} as const;

export const PROFILE_ROUTE = {
  detail: createPath(`${PROFILE_BASE}/detail`),
  edit: createPath(`${PROFILE_BASE}/edit`),
  password: createPath(`${PROFILE_BASE}/password`),
  userPosts: createPath(`${PROFILE_BASE}/user-posts`),
  userPostDetail: (postId: string) => createPath(`${PROFILE_BASE}/user-posts/${postId}`),
  userPostDetailEdit: (postId: string) => createPath(`${PROFILE_BASE}/user-posts/${postId}/edit`),
} as const;

export const QR_ROUTE = {
  qr: createPath(`${QR_BASE}/qr`),
  purchase: createPath(`${QR_BASE}/purchase`),
  qrProfile: createPath(`${QR_BASE}/qr-profile`),
  qrProfileSetting: createPath(`${QR_BASE}/qr-profile-setting`),
} as const;

export const CHAT_ROUTE = {
  message: (conversationId: string) => createPath(`${CHAT_BASE}/${conversationId}`),
  information: (conversationId: string) => createPath(`${CHAT_BASE}/${conversationId}/information`),
} as const;

export const HANDOVER_ROUTE = {
  detail: (id: string) => createPath(`${HANDOVER_BASE}/${id}`),
  evidenceUpload: (id: string) => createPath(`${HANDOVER_BASE}/${id}/evidence-upload`),
  all: (filter: `ongoing` | `past`) => createPath(`${HANDOVER_BASE}/all?filter=${filter}`),
} as const;

export const POST_ROUTE = {
  index: '/(tabs)/post',
  detail: (p: string) => createPath(`${POST_BASE}/${p}`),

  search: createPath(`${POST_BASE}/search`),
  searchFilter: createPath(`${POST_BASE}/search/filter`),
  searchResult: createPath(`${POST_BASE}/search/result`),
} as const;

export const SHARED_ROUTE = {
  matching: (postId: string) => createPath(`/(shared)/matching/${postId}`),
  matchingDetail: (postId: string, otherPostId: string) => createPath(`/(shared)/matching/${postId}/${otherPostId}`),
  handoverRequest: (postId: string, otherPostId: string) => createPath(`/(shared)/matching/${postId}/${otherPostId}/handover-request`),
} as const;

const CREATE_POST_BASE = `/(post-create)` as const;
export const POST_CREATE = {
  index: createPath(`${CREATE_POST_BASE}`),
  stepper: createPath(`${CREATE_POST_BASE}/stepper`),
  category: createPath(`${CREATE_POST_BASE}/stepper/category`),
  subCategory: createPath(`${CREATE_POST_BASE}/stepper/sub-category`),
  identity: createPath(`${CREATE_POST_BASE}/stepper/identity`),
  location: createPath(`${CREATE_POST_BASE}/stepper/location`),
  timeline: createPath(`${CREATE_POST_BASE}/stepper/timeline`),
  itemDetail: createPath(`${CREATE_POST_BASE}/stepper/detail`),
} as const;