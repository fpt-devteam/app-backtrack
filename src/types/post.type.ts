import { Nullable } from "./global.type";

export enum PostType {
  Lost = 'Lost',
  Found = 'Found',
}

export interface LocationResponse {
  latitude: number;
  longitude: number;
}

export interface PostResponse {
  id: string;
  postType: string; // "Lost" | "Found"
  itemName: string;
  description: string;
  material: string[];
  brands: string[];
  colors: string[];
  imageUrls: string[];
  location: LocationResponse | null;
  eventTime: string; // ISO 8601 date string
  createdAt: string; // ISO 8601 date string
}

export interface PagedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
}

export interface ApiError {
  code: string;
  message: string;
  statusCode: number;
  details?: any;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: ApiError | null;
  correlationId: string;
}

export interface LaTLng {
  latitude: number;
  longitude: number;
}

export interface GetPostsParams {
  page?: number;
  pageSize?: number;
  postType?: string; // "Lost" | "Found"
  searchTerm?: string;
  location?: Partial<LaTLng>;
  radiusInKm?: number;
}

export interface PostFilters {
  postType: Nullable<string>; // "Lost" | "Found" | null (all)
  searchTerm: string;
  location: Nullable<LaTLng>;
  radiusInKm: Nullable<number>;
}

export type PostListItem = PostResponse;
export type PostDetail = PostResponse;
