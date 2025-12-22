import { Nullable } from "../../../shared/types/global.type";
import { GoogleMapDetailLocation, GoogleMapLocation } from "../../../shared/types/location.type";

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


export type CreateReportRequest = {
  postType: string;
  itemName: string;
  description: string;
  imageUrls: string[];

  materials: string[] | null;
  brands: string[] | null;
  colors: string[] | null;

  location: GoogleMapLocation | null;
  externalPlaceId: string | null;
  displayAddress: string | null;

  eventTime: Date; // UTC 0
};

export type CreateReportResponse = {
  success: boolean;
  data: ReportDetails | null,
  error: string | null,
  correlationId: string | null,
};

export type ReportDetails = {
  id: string;
  postType: string;
  itemName: string;
  description: string;
  imageUrls: string[];

  materials: string[] | null;
  brands: string[] | null;
  colors: string[] | null;
  detailLocation: GoogleMapDetailLocation | null;

  eventTime: Date;
  createdAt: Date;
};