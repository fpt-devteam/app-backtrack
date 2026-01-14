import { ApiResponse, PagedResponse } from "@/src/api/common/api.types";
import { QrCodeData, QrItemEntity, QrOwnerEntity } from "./qr.type";

export type CreateQrCodeRequest = {
  item: QrItemEntity;
};

export type CreateQrCodeResponse = ApiResponse<QrCodeData>;

export type UpdateQrCodeRequest = QrItemEntity;


export type UpdateQrCodeResponse = ApiResponse<QrCodeData>;

export type GetQrCodeByIdResponse = ApiResponse<QrCodeData & { owner: QrOwnerEntity }>;

export type GetQrCodesRequest = {
  page?: number;
  pageSize?: number;
};

export type GetQrCodesResponse = ApiResponse<PagedResponse<QrCodeData>>;
