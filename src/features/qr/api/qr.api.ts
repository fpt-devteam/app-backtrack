import type { CreateQrCodeRequest, CreateQrCodeResponse, GetQrCodeByIdResponse, GetQrCodesRequest, GetQrCodesResponse, UpdateQrCodeRequest, UpdateQrCodeResponse } from "@/src/features/qr/types";
import { DEFAULT_PAGED_REQUEST, privateClient } from "@/src/shared/api";

export const QR_API = {
  base: "/api/qr/qr-codes",
  detail: (id: string) => `/api/qr/qr-codes/${id}`,
  image: (publicCode: string) => `/api/qr/qr-codes/${publicCode}/image`,
} as const;

export const createQrCode = async (req: CreateQrCodeRequest) => {
  const response = await privateClient.post<CreateQrCodeResponse>(QR_API.base, req);
  return response.data;
};

export const updateQrCode = async (id: string, req: UpdateQrCodeRequest) => {
  const response = await privateClient.put<UpdateQrCodeResponse>(`${QR_API.detail(id)}/item`, req);
  return response.data;
};

export const getQrCodeById = async (id: string) => {
  const response = await privateClient.get<GetQrCodeByIdResponse>(QR_API.detail(id));
  return response.data;
};

export const getQrCodes = async (params: GetQrCodesRequest = DEFAULT_PAGED_REQUEST) => {
  const response = await privateClient.get<GetQrCodesResponse>(QR_API.base, { params });
  return response.data;
};

export const getQrCodeImage = async (publicCode: string) => {
  const response = await privateClient.get(QR_API.image(publicCode), {
    responseType: 'arraybuffer',
  });
  return response.data;
};
