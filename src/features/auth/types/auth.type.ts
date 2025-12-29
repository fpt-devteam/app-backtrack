import { Nullable } from "@/src/shared/types";
import { Auth } from "firebase/auth";
import { LoginRequest } from "./auth.dto";

export type AppUser = {
  id: string;
  email: string | null;
  displayName: string | null;
  avatar?: string | null;
  globalRole: string;
};

export type RegisterFirebaseRequest = {
  auth: Auth;
  email: string;
  password: string;
};

export type RegisterFirebaseResponse = {
  idToken: string;
};

export type RegisterRequest = LoginRequest & {
  confirmPassword: string;
};

export type RegisterResponse = {
  idToken: string;
};

export type RegisterCredentials = LoginRequest & {
  displayName?: string;
};

export type AuthState = {
  isAppReady: boolean;
  isLoggedIn: boolean;
};

export type UserGlobalData = {
  user: Nullable<AppUser>;
};
