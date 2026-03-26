import { AppUser } from "@/src/features/auth/types";
import { ApiResponse } from "@/src/shared/api";
import { PublicProfile } from "./profile.type";

export type GetMeResponse = ApiResponse<AppUser>;

export type UpdateProfileRequest = {
  displayName?: string;
  avatarUrl?: string;
  showEmail?: boolean;
  showPhone?: boolean;
  phone?: string;
};

export type UpdateProfileResponse = ApiResponse<AppUser>;

export type GetPublicProfileResponse = ApiResponse<Omit<PublicProfile, 'note'>>;