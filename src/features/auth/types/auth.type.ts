import type { Nullable } from "@/src/shared/types";

export type AppUser = {
  id: string;
  email: string | null;
  displayName: string | null;
  avatar: string;
  globalRole: string;
};

export type AuthState = {
  isAppReady: boolean;
  isLoggedIn: boolean;
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