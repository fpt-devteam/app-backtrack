import { GoogleMapDetailLocation, GoogleMapLocation } from "./location.type";

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