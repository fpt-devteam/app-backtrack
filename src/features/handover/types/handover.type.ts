import { AppUser } from "@/src/features/auth/types"
import type { Post } from "@/src/features/post/types"
import { Nullable } from "@/src/shared/types"

/**
 * 
 */
export type ReturnReportRole = "Finder" | "Owner"

export type Handover = {
  id: string
  finder: Nullable<AppUser>
  owner: Nullable<AppUser>
  finderPost: Nullable<Post>
  ownerPost: Nullable<Post>
  status: ReturnReportStatus
  activatedByRole: Nullable<ReturnReportRole>
  confirmedAt: Nullable<string>
  expiresAt: string
  createdAt: string
}

/**
 * 
 */
const RETURN_REPORT_STATUS = {
  Draft: "Draft",
  Active: "Active",
  Confirmed: "Confirmed",
  Rejected: "Rejected",
  Expired: "Expired",
}

export type ReturnReportStatus = keyof typeof RETURN_REPORT_STATUS