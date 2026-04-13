// src/features/handover/api/handover.api.ts

import { privateClient } from "@/src/shared/api"
import type {
  C2CReturnReportResponse,
  C2CReturnReportsResponse,
  CreateC2CReturnReportRequest,
  GetC2CReturnReportsRequest,
} from "@/src/features/handover/types"

export const RETURN_REPORT_API = {
  c2cList: "/api/core/return-reports/c2c",
  c2cDetail: (id: string) => `/api/core/return-reports/c2c/${id}`,
  c2cCreate: "/api/core/return-reports/c2c",
  c2cOwnerConfirm: (id: string) => `/api/core/return-reports/c2c/${id}/owner-confirm`,
} as const

export async function getC2CReturnReportsApi(params?: GetC2CReturnReportsRequest) {
  const response = await privateClient.get<C2CReturnReportsResponse>(
    RETURN_REPORT_API.c2cList,
    { params },
  )
  return response.data
}

export async function getC2CReturnReportByIdApi(id: string) {
  const response = await privateClient.get<C2CReturnReportResponse>(
    RETURN_REPORT_API.c2cDetail(id),
  )
  return response.data
}

export async function createC2CReturnReportApi(req: CreateC2CReturnReportRequest) {
  const response = await privateClient.post<C2CReturnReportResponse>(
    RETURN_REPORT_API.c2cCreate,
    req,
  )
  return response.data
}

export async function ownerConfirmC2CReturnReportApi(id: string) {
  const response = await privateClient.patch<C2CReturnReportResponse>(
    RETURN_REPORT_API.c2cOwnerConfirm(id),
  )
  return response.data
}
