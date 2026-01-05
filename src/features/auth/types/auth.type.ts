import { Nullable } from "@/src/shared/types";

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
