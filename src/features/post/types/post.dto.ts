import type { UserLocation } from "@/src/features/map/types";
import type {
  ApiResponse,
  PagedRequest,
  PagedResponse,
} from "@/src/shared/api";
import { Nullable } from "@/src/shared/types";
import { LatLng } from "react-native-maps";
import type {
  Post,
  PostSearchOptions,
  PostSuggestion,
  SimilarPost
} from "./post.type";
import { PostMatchingStatus, PostType } from "./post.enum";

export type PostsRequest = {
  postType?: PostType;
  searchTerm?: string;
  radiusInKm?: number;
  authorId?: string;
  location: Nullable<LatLng>;
} & PagedRequest;

export type PostsResponse = ApiResponse<PagedResponse<Post>>;

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
