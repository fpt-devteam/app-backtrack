import { ApiResponse } from "@/src/shared/api";
import {
  UpdateMyQrDesignRequest,
  UserQrCode,
  UserQrDesign,
  UserSubscription,
  UserSubscriptionPlan,
} from "./qr.type";

export type GetMyQrCodeResponse = ApiResponse<UserQrCode>;

export type GetMyQrDesignResponse = ApiResponse<UserQrDesign>;

export type UpdateMyQrDesignPayload = UpdateMyQrDesignRequest;

export type UpdateMyQrDesignResponse = ApiResponse<UserQrDesign>;

export type GetMySubscriptionResponse = ApiResponse<UserSubscription>;

export type SubscriptionRequest = {
  priceId: string;
};

export type GetAllSubscriptionPlansResponse = ApiResponse<UserSubscriptionPlan[]>;