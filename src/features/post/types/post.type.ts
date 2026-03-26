import { AppUser } from "@/src/features/auth/types";
import type { UserLocation } from "@/src/features/map/types";
import type { PostType } from "@/src/features/post/types";
import { Nullable } from "@/src/shared/types";
import type { LatLng } from "react-native-maps";

export type PostFilters = {
  postType?: PostType;
  location: LatLng;
  searchTerm?: string;
  radiusInKm?: number;
  authorId?: string;
};

export type PostImage = {
  id: string;
  url: string;
  displayOrder: number;
  createdAt: string;
};

export type Post = {
  id: string;
  postType: PostType;
  itemName: string;
  images: PostImage[];
  description: string | null;
  distinctiveMarks: string | null;
  organization: Nullable<string>;
  eventTime: Date;
  createdAt: Date;
  author: AppUser;
} & UserLocation;

export type SimilarPostMatchingLevel = "Low" | "Medium" | "High" | "VeryHigh";

export type SimilarPostCriterionPoint = {
  label: string;
  detail: string;
};

export type SimilarPostCriterionResult = {
  score: number;
  points?: Nullable<SimilarPostCriterionPoint[]>;
};

export type SimilarPostCriteria = {
  visualAnalysis: SimilarPostCriterionResult;
  description: SimilarPostCriterionResult;
  location: SimilarPostCriterionResult;
  timeWindow: SimilarPostCriterionResult;
};

export type SimilarPost = {
  id: string;
  postType: PostType;
  itemName: string;
  description: string;
  images: PostImage[];
  eventTime: Date;
  matchScore: number;
  distanceMeters: number;
  matchingLevel: SimilarPostMatchingLevel;
  isAssessed: boolean;
  assessmentSummary: Nullable<string>;
  criteria: Nullable<SimilarPostCriteria>;
} & UserLocation;
