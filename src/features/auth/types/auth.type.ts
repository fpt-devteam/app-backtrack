import type { Nullable } from "@/src/shared/types";


const USER_STATUS = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
} as const;

export type UserStatus = typeof USER_STATUS[keyof typeof USER_STATUS];

/**
 */
export type AppUser = {
  id: string;
  email: Nullable<string>;
  phone: Nullable<string>;
  displayName: Nullable<string>;
  avatarUrl: string;
  globalRole: string;
  showEmail: boolean;
  showPhone: boolean;
  postActionLimit?: number;
  postActionCount: number;
  status: UserStatus;
};

export type UserGlobalData = {
  user: Nullable<AppUser>;
};

export const EMAIL_STATUS = {
  VERIFIED: "Verified",
  NOT_VERIFIED: "NotVerified",
  NOT_FOUND: "NotFound",
}

export type EmailStatus = typeof EMAIL_STATUS[keyof typeof EMAIL_STATUS];