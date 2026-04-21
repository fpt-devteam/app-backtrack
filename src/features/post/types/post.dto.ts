import type { UserLocation } from "@/src/features/map/types";
import type {
  ApiResponse
} from "@/src/shared/api";
import { Nullable } from "@/src/shared/types";
import { LatLng } from "react-native-maps";
import { PostMatchingStatus, PostType } from "./post.enum";
import {
  PostCategory,
  PostItem,
  PostSubcategory,
  PostSubcategoryCode,
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
  [key in PostCategory]: Post[];
};

export type PostFeedResponse = ApiResponse<PostFeedResult>;

/**
 *  PostCreateRequest - This type defines the structure of the request body when creating a new post.
 *  It includes the post type, item name, description, image URLs, distinctive marks, event time, and location details (latitude and longitude).
 */
export type PostCreateRequest = {
  postTitle: string;
  postType: PostType;
  category: PostCategory;
  subcategoryCode: PostSubcategoryCode
  imageUrls: string[];
  eventTime: Date;
  electronicDetail?: ElectronicDetail
} & Omit<UserLocation, "radiusInKm">;

export type PostCreateResponse = ApiResponse<Post>;

export type PostGetByIdRequest = {
  postId: string;
};

export type PostGetByIdResponse = ApiResponse<Post>;

export type MatchingPostsRequest = {
  postId: string;
};

export type MatchingPostsData = {
  similarPosts: SimilarPost[];
};

export type MatchingPostsResponse = ApiResponse<MatchingPostsData>;

export type AnalyzeImageRequest = {
  imageUrl: string;
};
export type AnalyzeImageData = Omit<PostItem, "size" | "additionalDetails">;

export type AnalyzeImageResponse = ApiResponse<AnalyzeImageData>;

export type GetAllMyPostResponse = ApiResponse<Post[]>;

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
 * 
 */
export type ElectronicDetail = {
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

export type PersonalBelongingDetail = {
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

export type CardDetail = {
  itemName: string;
  cardNumberHash: Nullable<string>;
  cardNumberMasked: Nullable<string>;
  holderName: Nullable<string>;
  holderNameNormalized: Nullable<string>;
  dateOfBirth: Date | null;
  issueDate: Date | null;
  expiryDate: Date | null;
  issuingAuthority: Nullable<string>;
  ocrText: Nullable<string>;
};

/**
 * Post Subcategory Response
 * This type defines the structure of the response when fetching post subcategories.
 * It includes an array of PostSubcategory objects wrapped in an ApiResponse.
 */
export type PostSubcategoryResponse = ApiResponse<PostSubcategory[]>;
