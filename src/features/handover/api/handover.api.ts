// src/features/handover/api/handover.api.ts

import type {
  C2CHandoversResponse,
  C2CReturnReportResponse,
  CreateC2CReturnReportRequest,
  GetC2CHandoverRequest,
} from "@/src/features/handover/types";
import { privateClient } from "@/src/shared/api";

export const RETURN_REPORT_API = {
  // C2C
  c2cList: "/api/core/return-reports/c2c",
  c2cDetail: (id: string) => `/api/core/return-reports/c2c/${id}`,
  c2cCreate: "/api/core/return-reports/c2c",
  c2cActivate: (id: string) => `/api/core/return-reports/c2c/${id}/activate`,
  c2cConfirm: (id: string) => `/api/core/return-reports/c2c/${id}/confirm`,
  c2cByPartner: (partnerId: string) => `/api/core/return-reports/c2c/partner/${partnerId}`,
} as const;

// ─── C2C ─────────────────────────────────────────────────────────────────────

export async function getC2CReturnReportsApi(params?: GetC2CHandoverRequest) {
  const response = await privateClient.get<C2CHandoversResponse>(
    RETURN_REPORT_API.c2cList,
    { params },
  );
  return response.data;
}

export async function getC2CReturnReportByIdApi(id: string) {
  const response = await privateClient.get<C2CReturnReportResponse>(
    RETURN_REPORT_API.c2cDetail(id),
  );
  return response.data;
}

export async function createC2CReturnReportApi(
  req: CreateC2CReturnReportRequest,
) {
  const response = await privateClient.post<C2CReturnReportResponse>(
    RETURN_REPORT_API.c2cCreate,
    req,
  );
  return response.data;
}

/**
 * Moves a Draft report → Active.
 * Either Finder or Owner can call this. The caller becomes the activator
 * and will be blocked from confirming (counterpart must confirm instead).
 */
export async function activateC2CReturnReportApi(id: string) {
  const response = await privateClient.patch<C2CReturnReportResponse>(
    RETURN_REPORT_API.c2cActivate(id),
  );
  return response.data;
}

/**
 * Confirms a successful handover (Active → Confirmed).
 * Must be called by the counterpart of whoever activated the report.
 */
export async function confirmC2CReturnReportApi(id: string) {
  const response = await privateClient.patch<C2CReturnReportResponse>(
    RETURN_REPORT_API.c2cConfirm(id),
  );
  return response.data;
}

/**
 * Returns all C2C return reports involving a specific partner user.
 * Backend endpoint: GET /api/core/return-reports/c2c/partner/{partnerId}
 */
export async function getC2CReturnReportsByPartnerApi(partnerId: string) {
  const response = await privateClient.get<C2CHandoversResponse>(
    RETURN_REPORT_API.c2cByPartner(partnerId),
  );
  return response.data;
}
