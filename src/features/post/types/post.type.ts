import { AppUser } from "@/src/features/auth/types"
import type { UserLocation } from "@/src/features/map/types"
import { postOptionSchema } from "@/src/features/post/schemas"
import { Nullable } from "@/src/shared/types"
import type { LatLng } from "react-native-maps"
import * as yup from "yup"
import { PostType } from "./post.enum"

export type PostFilters = {
  postType?: PostType
  location: LatLng
  searchTerm?: string
  radiusInKm?: number
  authorId?: string
}

export type PostImage = {
  id: string
  url: string
  displayOrder: number
  createdAt: string
}

/**
 * ItemCategory - This type defines the categories of items that can be associated with a post. The categories include:
 */
export const ITEM_CATEGORIES = {
  ELECTRONICS: "electronics",
  CLOTHING: "clothing",
  ACCESSORIES: "accessories",
  DOCUMENTS: "documents",
  WALLET: "wallet",
  SUITCASE: "suitcase",
  BAGS: "bags",
  KEYS: "keys",
  OTHER: "other",
} as const

export type ItemCategory = typeof ITEM_CATEGORIES[keyof typeof ITEM_CATEGORIES]

/*
 */
export const POST_STATUS = {
  ACTIVE: "Active",
  RETURNED: "Returned",
  ARCHIVED: "Archived",
  EXPIRED: "Expired"
} as const

export type PostStatus = typeof POST_STATUS[keyof typeof POST_STATUS]

/**
 */
export type UserPost = {
  id: string
  postType: PostType
  status: PostStatus
  category: PostCategory
  postTitle: Nullable<string>
  author: AppUser
  subcategoryId: string
  imageUrls: string[]

  // 
  location: LatLng
  externalPlaceId: string
  displayAddress: string

  // 
  personalBelongingDetail?: Nullable<SimilarPostPersonalBelongingDetail>
  cardDetail?: Nullable<SimilarPostCardDetail>
  electronicDetail?: Nullable<SimilarPostElectronicDetail>
  otherDetail?: Nullable<SimilarPostOtherDetail>

  // 
  eventTime: Date
  createdAt: Date
}

/**
 * Post - This type defines the structure of a post. 
 */
export type Post = {
  id: string
  postType: PostType
  postTitle: Nullable<string>
  status: PostStatus
  category: PostCategory
  subcategoryId: string
  imageUrls: string[]
  description: string | null
  organization: Nullable<string>
  eventTime: Date
  createdAt: Date
  author: AppUser
  distanceInMeters?: number
} & Pick<UserLocation, "location" | "externalPlaceId" | "displayAddress">

/**
 *  SimilarPostMatchingLevel - This type defines the levels of similarity for matching posts. The levels include:
 * - Low: Indicates a low level of similarity between the posts.
 * - Medium: Indicates a moderate level of similarity between the posts.
 * - High: Indicates a high level of similarity between the posts.
 * - VeryHigh: Indicates a very high level of similarity between the posts.
 */
export type SimilarPostMatchingLevel = "Low" | "Medium" | "High" | "VeryHigh"

export type SimilarPostCriterionPoint = {
  label: string
  detail: string
}

export type SimilarPostCriterionResult = {
  score: number
  points?: Nullable<SimilarPostCriterionPoint[]>
}

export type SimilarPostCriteria = {
  visualAnalysis: SimilarPostCriterionResult
  description: SimilarPostCriterionResult
  location: SimilarPostCriterionResult
  timeWindow: SimilarPostCriterionResult
}

/**
 * POST_SEARCH_MODE - This constant defines the modes of searching for posts. The modes include:
 * - KEYWORD: Indicates that the search will be based on keywords.
 * - SEMANTIC: Indicates that the search will be based on semantic analysis.
 */
export const POST_SEARCH_MODE = {
  KEYWORD: "keyword",
  SEMANTIC: "semantic",
} as const

export type PostSearchMode = typeof POST_SEARCH_MODE[keyof typeof POST_SEARCH_MODE]

/**
 * PostSuggestion - This type defines the structure of a post suggestion.
 * It includes details such as the image URL and item name associated with the suggestion.
 */
export type PostSuggestion = {
  itemName: string
  imageUrl: string
}

export type PostSearchOptions = yup.InferType<typeof postOptionSchema>


/**
 * POST_CATEGORIES 
 * This constant defines the categories of posts that can be created. 
 */
export const POST_CATEGORIES = {
  ELECTRONICS: "Electronics",
  CARD: "Cards",
  PERSONAL_BELONGINGS: "PersonalBelongings",
  OTHERS: "Others",
} as const;

export type PostCategory = typeof POST_CATEGORIES[keyof typeof POST_CATEGORIES]

/**
 * ELECTRONICS_SUBCATEGORY 
 * This constant defines the subcategories of electronics that can be associated with a post.
 */
export const ELECTRONICS_SUBCATEGORY = {
  PHONE: "phone",
  LAPTOP: "laptop",
  SMARTWATCH: "smartwatch",
  CHARGER_ADAPTER: "charger_adapter",
  MOUSE: "mouse",
  KEYBOARD: "keyboard",
  POWERBANK: "powerbank",
  POWER_OUTLET: "power_outlet",
  HEADPHONE: "headphone",
  EARPHONE: "earphone",
} as const

export type ElectronicsSubcategory = typeof ELECTRONICS_SUBCATEGORY[keyof typeof ELECTRONICS_SUBCATEGORY]

/**
 * CARD_SUBCATEGORY
 * This constant defines the subcategories of cards that can be associated with a post.
 */
export const CARD_SUBCATEGORY = {
  BANK_CARD: "bank_card",
  COMPANY_CARD: "company_card",
  DRIVER_LICENSE: "driver_license",
  IDENTIFICATION_CARD: "identification_card",
  PASSPORT: "passport",
  PERSONAL_CARD: "personal_card",
  STUDENT_CARD: "student_card",
} as const

export type CardSubcategory = typeof CARD_SUBCATEGORY[keyof typeof CARD_SUBCATEGORY]

/**
 * PERSONAL_BELONGING_SUBCATEGORY
 * This constant defines the subcategories of personal belongings that can be associated with a post.
 */
export const PERSONAL_BELONGING_SUBCATEGORY = {
  BACKPACK: "backpack",
  CLOTHINGS: "clothings",
  JEWELRY: "jewelry",
  KEYS: "keys",
  SUITCASES: "suitcases",
  WALLETS: "wallets",
} as const

export type PersonalBelongingSubcategory = typeof PERSONAL_BELONGING_SUBCATEGORY[keyof typeof PERSONAL_BELONGING_SUBCATEGORY]

/**
 * OTHER_SUBCATEGORY
 * This constant defines the subcategories of other items that can be associated with a post.
 */
export const OTHER_SUBCATEGORY = {
  OTHERS: "others",
} as const

export type OtherSubcategory = typeof OTHER_SUBCATEGORY[keyof typeof OTHER_SUBCATEGORY]

export type PostSubcategoryCode =
  | ElectronicsSubcategory
  | CardSubcategory
  | PersonalBelongingSubcategory
  | OtherSubcategory

export type PostSubcategory = {
  id: string,
  category: PostCategory,
  code: PostSubcategoryCode,
  name: string,
  displayOrder: number,
}

/**
* 
*/
export const MATCH_STRENGTH = {
  Strong: "Strong",
  Partial: "Partial",
  Weak: "Weak",
  Mismatch: "Mismatch",
} as const;

export type MatchStrength = typeof MATCH_STRENGTH[keyof typeof MATCH_STRENGTH];

/**
 * 
 */
export type MatchEvidence = {
  key: string;
  strength: MatchStrength;
  lostValue: string;
  foundValue: string;
  note: string;
}

/**
 * 
 */
export const MATCH_STATUS = {
  Pending: "Pending",
  Confirmed: "Confirmed",
  Rejected: "Rejected",
} as const;

export type MatchStatus = typeof MATCH_STATUS[keyof typeof MATCH_STATUS];

/**
 * 
 */
export type SimilarPostPersonalBelongingDetail = {
  itemName?: Nullable<string>;
  color?: Nullable<string>;
  brand?: Nullable<string>;
  material?: Nullable<string>;
  size?: Nullable<string>;
  condition?: Nullable<string>;
  distinctiveMarks?: Nullable<string>;
  aiDescription?: Nullable<string>;
  additionalDetails?: Nullable<string>;
}

export type SimilarPostCardDetail = {
  itemName?: Nullable<string>;
  cardNumberMasked?: Nullable<string>;
  holderName?: Nullable<string>;
  dateOfBirth?: Nullable<Date | string>;
  issueDate?: Nullable<Date | string>;
  expiryDate?: Nullable<Date | string>;
  issuingAuthority?: Nullable<string>;
  additionalDetails?: Nullable<string>;
  aiDescription?: Nullable<string>;
}

export type SimilarPostElectronicDetail = {
  itemName?: Nullable<string>;
  brand?: Nullable<string>;
  model?: Nullable<string>;
  color?: Nullable<string>;
  hasCase?: Nullable<boolean>;
  caseDescription?: Nullable<string>;
  screenCondition?: Nullable<string>;
  lockScreenDescription?: Nullable<string>;
  distinguishingFeatures?: Nullable<string>;
  aiDescription?: Nullable<string>;
  additionalDetails?: Nullable<string>;
}

export type SimilarPostOtherDetail = {
  itemName?: Nullable<string>;
  primaryColor?: Nullable<string>;
  aiDescription?: Nullable<string>;
  additionalDetails?: Nullable<string>;
}

/**
 * 
 */
export type SimilarPost = {
  id: string
  postType: PostType
  postTitle: Nullable<string>
  category: PostCategory
  subcategoryId: string
  personalBelongingDetail?: Nullable<SimilarPostPersonalBelongingDetail>
  cardDetail?: Nullable<SimilarPostCardDetail>
  electronicDetail?: Nullable<SimilarPostElectronicDetail>
  otherDetail?: Nullable<SimilarPostOtherDetail>
  imageUrls: string[]
  eventTime: string
  score: number;
  evidence: MatchEvidence[];
  status: MatchStatus;
  timeGap: string;
  locationDistance: number;
} & Omit<UserLocation, "radiusInKm">


export type BasePost = {
  postType: PostType
  postTitle: Nullable<string>
  location: LatLng
  externalPlaceId: string
  displayAddress: string
  category: PostCategory
  imageUrls: string[]
}
