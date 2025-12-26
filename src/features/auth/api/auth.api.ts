import { privateClient, publicClient } from "@/src/api/common";
import { ApiResponse } from "@/src/shared/types/global.type";
import { MeResponse, SyncRequest, SyncResponse } from "../types";

const AUTH = {
  me: "/core/users",
  sync: "/core/users",
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
  return res.data as ApiResponse<SyncResponse>;
}

