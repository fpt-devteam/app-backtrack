import type { ApiResponse, PagedRequest, PagedResponse } from "@/src/shared/api";
import type { QrCodeData, QrItemEntity, QrOwnerEntity } from "./qr.type";

export type CreateQrCodeRequest = {
  item: QrItemEntity;
};

export type CreateQrCodeResponse = ApiResponse<QrCodeData>;

export type UpdateQrCodeRequest = QrItemEntity;


export type UpdateQrCodeResponse = ApiResponse<QrCodeData>;

export type GetQrCodeByIdResponse = ApiResponse<QrCodeData & { owner: QrOwnerEntity }>;

export type GetQrCodesRequest = PagedRequest;

export type GetQrCodesResponse = ApiResponse<PagedResponse<QrCodeData>>;
