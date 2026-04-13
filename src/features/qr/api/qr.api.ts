import type {
  GetAllSubscriptionPlansResponse,
  GetMyQrCodeResponse,
  GetMyQrDesignResponse,
  GetMySubscriptionResponse,
  UpdateMyQrDesignPayload,
  UpdateMyQrDesignResponse,
} from "@/src/features/qr/types";
import { privateClient } from "@/src/shared/api";

export const QR_API = {
  me: "/api/core/qr/me",
  design: "/api/core/me/design",
  getMySubscription: "/api/core/subscriptions/me",
  getAllSubscriptionPlans: "/api/core/subscription-plans",
} as const;

export async function getMyQRCode(): Promise<GetMyQrCodeResponse> {
  const response = await privateClient.get<GetMyQrCodeResponse>(QR_API.me);
  return response.data;
}

export async function getMySubscription() {
  const response = await privateClient.get<GetMySubscriptionResponse>(QR_API.getMySubscription);
  return response.data;
}

export async function getMyQrDesign() {
  const response = await privateClient.get<GetMyQrDesignResponse>(QR_API.design);
  return response.data;
}

export async function updateMyQrDesign(request: UpdateMyQrDesignPayload) {
  const response = await privateClient.put<UpdateMyQrDesignResponse>(
    QR_API.design,
    request,
  );
  return response.data;
}

export async function getAllSubscriptionPlans() {
  const response = await privateClient.get<GetAllSubscriptionPlansResponse>(QR_API.getAllSubscriptionPlans);
  return response.data;
}