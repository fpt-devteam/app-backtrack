import type { AppUser } from "@/src/features/auth/types";
import type { ApiResponse } from "@/src/shared/api";

export type SyncRequest = {
  idToken: string;
};

export type SyncResponse = ApiResponse<AppUser>;

export type MeResponse = ApiResponse<AppUser>;

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  idToken: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
};

export type RegisterResponse = {
  idToken: string;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type ForgotPasswordResponse = {
  ok: true;
};
