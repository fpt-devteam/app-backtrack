import { ExternalPathString, RelativePathString } from "@/.expo/types/router";

type RoutePath = ExternalPathString | RelativePathString;
const createPath = <T extends string>(path: T): RoutePath => path as RoutePath;

const PROTECTED = "/(protected)" as const;
const POST_BASE = `${PROTECTED}/posts` as const;
const CHAT_BASE = `${PROTECTED}/chat/conversations` as const;
const QR_BASE = "/qr" as const;

export const PROFILE_ROUTE = {
  index: `${PROTECTED}/profile`,
} as const;

export const POST_ROUTE = {
  index: `${PROTECTED}/(tabs)/posts`,
  create: `${POST_BASE}/create`,
  search: `${POST_BASE}/search`,
  searchLocation: `${POST_BASE}/search/location`,
  searchLocationInput: `${POST_BASE}/search/location-search`,
  searchResult: `${POST_BASE}/search/result`,
  details: (id: string) => createPath(`${POST_BASE}/${id}`),
  matching: (id: string) => createPath(`${POST_BASE}/${id}/matching`),
  detailMatch: (id: string, otherId: string) =>
    createPath(`${POST_BASE}/${id}/compare/${otherId}`),
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
  index: `${PROTECTED}/map`,
  search: `${PROTECTED}/map/search`,
} as const;

export const SHARED_ROUTE = {
  notAvailable: "/shared/not-available",
} as const;