import { ApiResponse, Nullable } from "../../../shared/types/global.type";
import { GoogleMapDetailLocation } from "../../../shared/types/location.type";
import { ReportType } from "./report.enum";

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

export type ReportPost = {
  id: string;
  postType: ReportType;
  itemName: string;
  imageUrls: string[];
  description: string | null;
  distinctiveMarks: string | null;
  eventTime: Date;
  createdAt: Date;
} & GoogleMapDetailLocation;

export type ReportCreateRequest = {
  postType: ReportType;
  itemName: string;
  description: string;
  imageUrls: string[];
  distinctiveMarks: string | null;
  eventTime: Date;
} & GoogleMapDetailLocation;

export type ReportCreateResponse = ApiResponse<ReportPost>;

export type ReportFilters = {
  authorId: Nullable<string>;
  reportType: Nullable<ReportType>;
  longitude: Nullable<number>;
  latitude: Nullable<number>;
  radiusInKm: Nullable<number>;
  page: number;
  pageSize: number;
};
