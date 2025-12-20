import { GoogleMapFormattedLocation } from "./location.type";

export type CreateReportRequest = {
  postType: string;
  itemName: string;
  description: string;
  imageUrls: string[];

  materials: string[] | null;
  brands: string[] | null;
  colors: string[] | null;

  location: GoogleMapFormattedLocation;
  eventTime: Date; // UTC 0
};

