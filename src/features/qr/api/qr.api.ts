import { privateClient } from "@/src/api/common/client";
import { CreateQrCodeRequest, CreateQrCodeResponse, GetQrCodeByIdResponse, GetQrCodesRequest, GetQrCodesResponse } from "@/src/features/qr/types";

export const QR_API = {
  base: "/api/qr/qr-codes",
  detail: (id: string) => `/api/qr/qr-codes/${id}`,
} as const;

export const createQrCode = async (req: CreateQrCodeRequest) => {
  const response = await privateClient.post<CreateQrCodeResponse>(QR_API.base, req);
  return response.data;
};

export const getQrCodeById = async (id: string) => {
  const response = await privateClient.get<GetQrCodeByIdResponse>(QR_API.detail(id));
  return response.data;
};

export const getQrCodes = async (params: GetQrCodesRequest = {}) => {
  const response = await privateClient.get<GetQrCodesResponse>(QR_API.base, {
    params: {
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 20,
    },
  });
  return response.data;
};
