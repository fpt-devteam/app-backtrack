import type { ApiResponse, PagedRequest, PagedResponse } from "@/src/shared/api"
import type { Handover, ReturnReportStatus } from "./handover.type"

// ─── C2C Return Report ────────────────────────────────────────────────────────

// POST /return-reports/c2c
export type CreateC2CReturnReportRequest = {
  finderPostId?: string
  ownerPostId?: string
}

export type CreateC2CReturnReportResponse = {
  handoverId: string
}

// GET /return-reports/c2c  (query params)
export type GetC2CHandoverRequest = {
  status?: ReturnReportStatus
} & PagedRequest

// Single report response
export type C2CReturnReportResponse = ApiResponse<Handover>

// Paged list response
export type C2CHandoversResponse = ApiResponse<PagedResponse<Handover>>

// ─── Org Return Report ────────────────────────────────────────────────────────

// POST /return-reports/org/{orgId}
export type CreateOrgReturnReportRequest = {
  finderPostId?: string
  ownerPostId?: string
  finderId?: string
  ownerId?: string
  status: ReturnReportStatus
}

// GET /return-reports/org/{orgId}  (query params)
export type GetOrgHandoverRequest = PagedRequest

// Single org report response
export type OrgReturnReportResponse = ApiResponse<Handover>

// Paged list of org reports
export type OrgHandoversResponse = ApiResponse<PagedResponse<Handover>>
