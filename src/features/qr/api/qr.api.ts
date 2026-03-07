import type { GetMyQrCodeResponse, GetMySubscriptionResponse, SubscriptionRequest } from "@/src/features/qr/types";
import { privateClient } from "@/src/shared/api";

export const QR_API = {
  me: "/api/qr/me",
  getMySubscription: "/api/qr/subscriptions/me",
  cancelSubscription: "/api/qr/subscriptions/me",
  subscription: "/api/qr/subscriptions",
} as const;

export async function getMyQRCode(): Promise<GetMyQrCodeResponse> {
  const response = await privateClient.get<GetMyQrCodeResponse>(QR_API.me);
  return response.data;
}

export async function getMySubscription() {
  const response = await privateClient.get<GetMySubscriptionResponse>(QR_API.getMySubscription);
  return response.data;
}

export async function cancelSubscription() {
  const response = await privateClient.delete<GetMyQrCodeResponse>(QR_API.cancelSubscription);
  return response.data;
}

export async function subscription(req: SubscriptionRequest) {
  const response = await privateClient.post<GetMyQrCodeResponse>(QR_API.subscription, req);
  return response.data;
}