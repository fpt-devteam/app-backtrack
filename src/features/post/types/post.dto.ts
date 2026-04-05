import type { UserLocation } from "@/src/features/map/types";
import type {
  ApiResponse,
  PagedRequest,
  PagedResponse,
} from "@/src/shared/api";
import { Nullable } from "@/src/shared/types";
import { LatLng } from "react-native-maps";
import { PostMatchingStatus, PostType } from "./post.enum";
import {
  ITEM_CATEGORIES,
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
  [key in (typeof ITEM_CATEGORIES)[keyof typeof ITEM_CATEGORIES]]: Post[];
};

export type PostFeedResponse = ApiResponse<PostFeedResult>;

/**
 *  PostCreateRequest - This type defines the structure of the request body when creating a new post.
 *  It includes the post type, item name, description, image URLs, distinctive marks, event time, and location details (latitude and longitude).
 */
export type PostCreateRequest = {
  postType: PostType;
  itemName: string;
  description: string;
  imageUrls: string[];
  distinctiveMarks: string | null;
  eventTime: Date;
} & UserLocation;

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
  imageBase64: string;
  mimeType: "image/jpeg" | "image/png" | "image/webp" | "image/gif";
};

export type AnalyzeImageData = {
  itemName: string;
  description: string;
};

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
export type PostSearchRequest = PostSearchOptions & PagedRequest

export type PostSearchResponse = ApiResponse<PagedResponse<Post>>;

// Post Suggestion
export type PostsSuggestionResponse = ApiResponse<PostSuggestion[]>;