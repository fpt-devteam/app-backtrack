import { AppUser } from "@/src/features/auth/types";
import type { UserLocation } from "@/src/features/map/types";
import { Nullable } from "@/src/shared/types";
import type { LatLng } from "react-native-maps";
import * as yup from "yup";
import { PostType } from "./post.enum";

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

export const POST_SEARCH_MODE = {
  KEYWORD: "keyword",
  SEMANTIC: "semantic",
} as const;

// Post Search Mode
export type PostSearchMode = typeof POST_SEARCH_MODE[keyof typeof POST_SEARCH_MODE];

export type PostSuggestion = {
  imageUrl: string;
  itemName: string;
}

/**
 * SearchPostOptions - This type defines the options for searching posts. It includes:
 * - query: The search query string.
 * - mode: The search mode, which can be either "keyword" or "semantic".
 * - filters: Optional filters that can be applied to the search, such as post type, location, search term, radius, and author ID.  
 */

const postOptionSchema = yup
  .object({
    query: yup
      .string()
      .trim()
      .required("Query is required!"),
    mode: yup
      .mixed<PostSearchMode>()
      .oneOf(Object.values(POST_SEARCH_MODE), "Invalid search mode!")
      .required("Search mode is required!"),
    filters: yup
      .object({
        location: yup.mixed<LatLng>().required("Location lat lng is required"),
        radiusInKm: yup
          .number()
          .min(1, "Radius must be at least 1 km!")
          .max(20, "Radius cannot exceed 20 km!")
          .required("Radius is required!"),
        postType: yup
          .mixed<PostType>()
          .oneOf(Object.values(PostType), "Invalid post type!")
      })
      .required("Filters are required!"),
  })
  .required();

export type PostSearchOptions = yup.InferType<typeof postOptionSchema>;