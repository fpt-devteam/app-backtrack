import { ApiResponse } from "@/src/shared/api";
import { UserQrCode, UserSubscription } from "./qr.type";

export type GetMyQrCodeResponse = ApiResponse<UserQrCode>;

export type GetMySubscriptionResponse = ApiResponse<UserSubscription>;

export type SubscriptionRequest = {
 priceId: string;
};