import type {
  ApiResponse
} from "@/src/shared/api";
import { Nullable } from "@/src/shared/types";
import { LatLng } from "react-native-maps";
import { UserLocation } from "../../map/types";
import { PostMatchingStatus, PostType } from "./post.enum";
import {
  PostCategory,
  PostSubcategory,
  PostSubcategoryCode,
  UserPost,
  type Post,
  type PostSearchOptions,
  type PostSuggestion,
  type SimilarPost
} from "./post.type";

/**
 * PostFeedRequest - This type defines the filters that can be applied when fetching posts.
 * It includes the post type, location, search term, radius in kilometers, and author ID. 
 */
export type PostFeedRequest = {
  postType?: PostType;
  searchTerm?: string;
  radiusInKm?: number;
  authorId?: string;
  location: Nullable<LatLng>;
};

type PostFeedResult = {
  electronics: Post[];
  cards: Post[];
  personalBelongings: Post[];
  others: Post[];
};

export type PostFeedResponse = ApiResponse<PostFeedResult>;

/**
 */
export type PostCreateRequest = {
  postTitle: string;
  postType: PostType;
  category: PostCategory;
  subcategoryCode: PostSubcategoryCode

  imageUrls: string[];
  eventTime: Date;

  electronicDetail?: ElectronicFormRequest
  cardDetail?: CardFormRequest
  personalBelongingDetail?: PersonalBelongingFormRequest
  otherDetail?: OtherFormRequest
} & Omit<UserLocation, "radiusInKm">;

/**
 *  PostUpdateRequest
 *  This type defines the structure of the request body when updating an existing post.
 */
export type PostUpdateRequest = {
  imageUrls?: string[];
  eventTime?: Date;

  electronicDetail?: ElectronicFormRequest
  cardDetail?: CardFormRequest
  personalBelongingDetail?: PersonalBelongingFormRequest
  otherDetail?: OtherFormRequest

  location?: LatLng;
  displayAddress?: string;
  externalPlaceId?: string;
}

export type PostCreateResponse = ApiResponse<Post>;

export type PostGetByIdRequest = {
  postId: string;
  params?: {
    isBlurImages: boolean;
  }
};

export type PostGetByIdResponse = ApiResponse<UserPost>;

export type MatchingPostsRequest = {
  postId: string;
};

export type MatchingPostsData = {
  similarPosts: SimilarPost[];
};

export type MatchingPostsResponse = ApiResponse<MatchingPostsData>;

/**
 */
export type PostDeleteByIdRequest = {
  postId: string;
};


/** 
 */
export type GetAllMyPostResponse = ApiResponse<{
  total: number;
  items: UserPost[];
}>;

// Post Matching Status Check
export type PostMatchingStatusCheckRequest = {
  postId: string;
};

export type PostMatchingStatusCheckResponse = ApiResponse<{
  postId: string;
  embeddingStatus: PostMatchingStatus;
  matchingStatus: PostMatchingStatus;
}>;


/*
 * Post Search Request and Response
*/
export type PostSearchRequest = PostSearchOptions;

export type PostSearchResponse = ApiResponse<Post[]>;

// Post Suggestion
export type PostsSuggestionResponse = ApiResponse<PostSuggestion[]>;

/**
 */
export type CardFormRequest = {
  itemName: string;
  cardNumber: Nullable<string>;
  holderName: Nullable<string>;
  holderNameNormalized: Nullable<string>;
  dateOfBirth: Nullable<string>;
  issueDate: Nullable<string>;
  expiryDate: Nullable<string>;
  issuingAuthority: Nullable<string>;
  ocrText: Nullable<string>;
  aiDescription: Nullable<string>;
};

/**
 */
export type ElectronicFormRequest = {
  itemName: string
  brand: Nullable<string>;
  model: Nullable<string>;
  color: Nullable<string>;
  hasCase: Nullable<boolean>;
  caseDescription: Nullable<string>;
  screenCondition: Nullable<string>;
  lockScreenDescription: Nullable<string>;
  distinguishingFeatures: Nullable<string>;
  aiDescription: Nullable<string>;
  additionalDetails: Nullable<string>;
};

/**
 */
export type PersonalBelongingFormRequest = {
  itemName: string;
  color: Nullable<string>;
  brand: Nullable<string>;
  material: Nullable<string>;
  size: Nullable<string>;
  condition: Nullable<string>;
  distinctiveMarks: Nullable<string>;
  aiDescription: Nullable<string>;
  additionalDetails: Nullable<string>;
};

/**
 */
export type OtherFormRequest = {
  itemName: string;
  primaryColor: Nullable<string>;
  aiDescription: Nullable<string>;
  additionalDetails: Nullable<string>;
};

/**
 * Post Subcategory Response
 * This type defines the structure of the response when fetching post subcategories.
 * It includes an array of PostSubcategory objects wrapped in an ApiResponse.
 */
export type PostSubcategoryResponse = ApiResponse<PostSubcategory[]>;
