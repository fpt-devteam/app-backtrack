import type { UserLocation } from "@/src/features/location/types";
import type { Post, PostMatchingStatus, PostType, SimilarPost } from "@/src/features/post/types";
import type { ApiResponse, PagedResponse } from "@/src/shared/api";
import type { LatLng } from "react-native-maps";

export type PostsRequest = {
  page?: number;
  pageSize?: number;
  postType?: PostType;
  location?: Partial<LatLng>;
  searchTerm?: string;
  radiusInKm?: number;
  authorId?: string;
};

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
  embeddingStatus: PostMatchingStatus,
  isReady: boolean,
  similarPosts: SimilarPost[],
};

export type MatchingPostsResponse = ApiResponse<MatchingPostsData>;

export type AnalyzeImageRequest = {
  imageBase64: string;
  mimeType: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif';
};

export type AnalyzeImageData = {
  itemName: string;
  description: string;
};

export type AnalyzeImageResponse = ApiResponse<AnalyzeImageData>;
