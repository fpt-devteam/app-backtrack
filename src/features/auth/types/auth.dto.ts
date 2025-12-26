import { ApiResponse } from "@/src/api/common/api.types";
import { UserProfile } from "./auth.type";

export type SyncRequest = {
  idToken: string;
};

export type SyncResponse = ApiResponse<UserProfile>;
export type MeResponse = ApiResponse<UserProfile>;

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  idToken: string;
};
