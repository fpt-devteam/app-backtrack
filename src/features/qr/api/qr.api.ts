import type {
  GetAllSubscriptionPlansResponse,
  GetMyQrCodeResponse,
  GetMySubscriptionResponse,
  PatchMyQrPayload,
  PatchMyQrResponse,
} from "@/src/features/qr/types";
import { privateClient } from "@/src/shared/api";

export const QR_API = {
  me: "/api/core/qr/me",
  getMySubscription: "/api/core/subscriptions/me",
  getAllSubscriptionPlans: "/api/core/subscription-plans",
} as const;

export async function getMyQRCode(): Promise<GetMyQrCodeResponse> {
  const response = await privateClient.get<GetMyQrCodeResponse>(QR_API.me);
  return response.data;
}

export async function patchMyQR(payload: PatchMyQrPayload): Promise<PatchMyQrResponse> {
  const response = await privateClient.patch<PatchMyQrResponse>(QR_API.me, payload);
  return response.data;
}

export async function getMySubscription() {
  const response = await privateClient.get<GetMySubscriptionResponse>(QR_API.getMySubscription);
  return response.data;
}

export async function getAllSubscriptionPlans() {
  const response = await privateClient.get<GetAllSubscriptionPlansResponse>(QR_API.getAllSubscriptionPlans);
  return response.data;
}
