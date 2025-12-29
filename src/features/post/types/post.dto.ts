import { ApiResponse, PagedResponse } from "@/src/api/common/api.types";
import { GoogleMapDetailLocation } from "@/src/shared/types/location.type";
import { LatLng } from "react-native-maps";
import { PostMatchingStatus, PostType } from "./post.enum";
import { Post, SimilarPost } from "./post.type";

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
} & GoogleMapDetailLocation;

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
