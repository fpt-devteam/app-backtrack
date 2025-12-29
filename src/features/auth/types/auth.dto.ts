import { ApiResponse } from "@/src/api/common/api.types";
import { AppUser } from "./auth.type";

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
