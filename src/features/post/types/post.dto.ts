import { ApiResponse, PagedResponse } from "@/src/api/common/api.types";
import { GoogleMapDetailLocation } from "@/src/shared/types/location.type";
import { LatLng } from "react-native-maps";
import { PostType } from "./post.enum";
import { Post } from "./post.type";

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
