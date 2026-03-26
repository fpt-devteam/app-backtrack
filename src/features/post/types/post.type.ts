import type { UserLocation } from "@/src/features/map/types";
import type { PostType } from "@/src/features/post/types";
import { Nullable } from "@/src/shared/types";
import type { LatLng } from "react-native-maps";

export type PostFilters = {
  postType?: PostType;
  location?: LatLng;
  searchTerm?: string;
  radiusInKm?: number;
  authorId?: string;
};

export type PostImage = {
  id: string;
  url: string;
  displayOrder: number;
  createdAt: string;
}

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
  author: {
    id: string;
    displayName: string | null;
    avatarUrl: string | null;
  };
} & UserLocation;

export type SimilarPost = Post & {
  matchScore: number;
  distanceMeters: number;
};
