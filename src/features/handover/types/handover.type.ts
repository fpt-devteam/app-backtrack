import { AppUser } from "@/src/features/auth/types"
import type { PostType } from "@/src/features/post/types"
import { Nullable } from "@/src/shared/types"

/**
 * 
 */
export type ReturnReportRole = "Finder" | "Owner"

/**
 * The simplified Post shape returned by the Handover API.
 * Uses `postTitle` instead of `item.itemName`, and dates are ISO strings.
 */
export type HandoverPost = {
  id: string
  author: Pick<AppUser, "id" | "displayName" | "avatarUrl">
  postType: PostType
  status: string
  category: string
  subcategoryId: string
  postTitle: string
  imageUrls: string[]
  location: { latitude: number; longitude: number }
  displayAddress: Nullable<string>
  eventTime: string
  createdAt: string
}

export type Handover = {
  id: string
  finder: Nullable<AppUser>
  owner: Nullable<AppUser>
  finderPost: Nullable<HandoverPost>
  ownerPost: Nullable<HandoverPost>
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
  Ongoing: "Ongoing",
  Delivered: "Delivered",
  Confirmed: "Confirmed",
  Rejected: "Rejected",
  Closed: "Closed",
}

export type ReturnReportStatus = keyof typeof RETURN_REPORT_STATUS