import { AppUser } from "@/src/features/auth/types"
import type { Post } from "@/src/features/post/types"
import { Nullable } from "@/src/shared/types"

/**
 */
export type HandoverRole = "Finder" | "Owner"

export type Handover = {
  id: string
  finder: Nullable<AppUser>
  owner: Nullable<AppUser>

  finderPost: Nullable<Post>
  ownerPost: Nullable<Post>

  status: HandoverStatus
  activatedByRole: Nullable<HandoverRole>

  evidenceImageUrls?: string[]

  expiresAt: string
  createdAt: string
  confirmedAt: Nullable<string>
  deliveredAt: Nullable<string>
}

/**
 * 
 */
export const HANDOVER_STATUS = {
  Ongoing: "Ongoing",
  Delivered: "Delivered",
  Confirmed: "Confirmed",
  Rejected: "Rejected",
  Closed: "Closed",
}

export type HandoverStatus = typeof HANDOVER_STATUS[keyof typeof HANDOVER_STATUS];
