import { ApiResponse } from "@/src/shared/api";
import { Nullable } from "@/src/shared/types";
import { PostCategory, PostSubcategoryCode } from "./post.type";

/**
 * Post Analyze Image Request and Response Types
 */
export type AnalyzeImageRequest = {
  imageUrls: string[];
  subcategoryCode: PostSubcategoryCode;
};

export type AnalyzeImageResponse = ApiResponse<AnalyzeImageData>;

/**
 * Post Analyze Image Data Type
 */
export type AnalyzeImageData = {
  category: PostCategory,
  electronic?: ElectronicAIAnalyzeData,
  card?: CardAIAnalyzeData,
  personalBelonging?: PersonalBelongingAIAnalyzeData,
  other?: OtherAIAnalyzeData,
};

/**
 * 
 */
export type ElectronicAIAnalyzeData = {
  itemName: string
  brand: Nullable<string>;
  model: Nullable<string>;
  color: Nullable<string>;
  hasCase: Nullable<boolean>;
  caseDescription: Nullable<string>;
  screenCondition: Nullable<string>;
  lockScreenDescription: Nullable<string>;
  // 
  distinguishingFeatures: Nullable<string>;
  aiDescription: Nullable<string>;
  additionalDetails: Nullable<string>;
};


/**
 * 
 */
export type CardAIAnalyzeData = {
  itemName: string
  ocrText: Nullable<string>;
  cardNumber: Nullable<string>;
  holderName: Nullable<string>;
  holderNameNormalized: Nullable<string>;
  issuingAuthority: Nullable<string>;
  dateOfBirth: Nullable<string>;
  issueDate: Nullable<string>;
  expiryDate: Nullable<string>;
  // 
  distinguishingFeatures: Nullable<string>;
  aiDescription: Nullable<string>;
  additionalDetails: Nullable<string>;
};

/**
 * 
 */
export type PersonalBelongingAIAnalyzeData = {
  itemName: string;
  color: Nullable<string>;
  brand: Nullable<string>;
  material: Nullable<string>;
  size: Nullable<string>;
  condition: Nullable<string>;
  // 
  distinctiveMarks: Nullable<string>;
  aiDescription: Nullable<string>;
  additionalDetails: Nullable<string>;
};


/**
 * 
 */
export type OtherAIAnalyzeData = {
  itemName: string;
  primaryColor: Nullable<string>;
  aiDescription: Nullable<string>;
  additionalDetails: Nullable<string>;
};
