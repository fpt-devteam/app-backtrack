import { GetPublicProfileResponse, UpdateProfileRequest } from "@/src/features/profile/types";
import { privateClient } from "@/src/shared/api";

const PROFILE_API = {
  getMe: "/api/core/users/me",
  updateProfile: "/api/core/users/me",
  getPublicProfile: (userId: string) => `/api/core/users/${userId}`,
}

export async function getMyProfile() {
  const response = await privateClient.get(PROFILE_API.getMe);
  return response.data;
}

export async function updateMyProfile(data: UpdateProfileRequest) {
  const response = await privateClient.patch(PROFILE_API.updateProfile, data);
  return response.data;
}

export async function getPublicProfile(userId: string) {
  const response = await privateClient.get<GetPublicProfileResponse>(PROFILE_API.getPublicProfile(userId));
  return response.data;
}