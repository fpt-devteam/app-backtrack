import { privateClient, publicClient } from "@/src/api/common";
import type { MeResponse, SyncRequest, SyncResponse } from "@/src/features/auth/types";
import type { ApiResponse } from "@/src/shared/types";

const AUTH = {
  me: "/api/core/users",
  sync: "/api/core/users",
};

export async function meApi() {
  const res = await privateClient.get<ApiResponse<MeResponse>>(AUTH.me);
  return res.data;
}

export async function syncUserApi(body: SyncRequest) {
  const { idToken } = body;
  const res = await publicClient.post(AUTH.sync, {}, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`,
    },
  });
  return res.data as SyncResponse;
}

