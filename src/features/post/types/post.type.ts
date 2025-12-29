import { LatLng } from "react-native-maps";
import { GoogleMapDetailLocation } from "../../../shared/types/location.type";
import { PostType } from "./post.enum";

export type PostFilters = {
  postType?: PostType;
  location?: Partial<LatLng>;
  searchTerm?: string;
  radiusInKm?: number;
  authorId?: string;
}

export type Post = {
  id: string;
  postType: PostType;
  itemName: string;
  imageUrls: string[];
  description: string | null;
  distinctiveMarks: string | null;
  eventTime: Date;
  createdAt: Date;
} & GoogleMapDetailLocation;

export type SimilarPost = Post & {
  similarityScore: number;
}

