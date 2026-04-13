import type { ApiResponse, PagedResponse } from "@/src/shared/api"
import type { Handover, ReturnReportStatus } from "./handover.type"

// POST /return-reports/c2c
export type CreateC2CReturnReportRequest = {
  finderPostId?: string
  ownerPostId?: string
  finderId?: string
  ownerId?: string
  status: ReturnReportStatus
}

// GET /return-reports/c2c  (query params)
export type GetC2CReturnReportsRequest = {
  page?: number
  pageSize?: number
  status?: ReturnReportStatus
}

// Single report response
export type C2CReturnReportResponse = ApiResponse<Handover>

// Paged list response
export type C2CReturnReportsResponse = ApiResponse<PagedResponse<Handover>>
