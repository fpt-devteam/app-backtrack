import { ApiResponse } from "@/src/shared/api";
import type { LatLng } from "react-native-maps";

/**
 * Status codes returned by the Google Places Autocomplete API.
 *
 * Possible values:
 * - `OK` - The API request was successful
 * - `ZERO_RESULTS` - The search was successful but returned no results (may occur if searching in a remote location)
 * - `INVALID_REQUEST` - The API request was malformed, generally due to a missing input parameter
 * - `OVER_QUERY_LIMIT` - Indicates one of the following:
 *   - QPS limits exceeded
 *   - Billing not enabled on the account
 *   - Monthly $200 credit or self-imposed usage cap exceeded
 *   - Payment method no longer valid (e.g., expired credit card)
 * - `REQUEST_DENIED` - The request was denied, generally because:
 *   - Missing API key
 *   - Invalid key parameter
 * - `UNKNOWN_ERROR` - An unknown error occurred
 */
export type GoogleMapResponseStatus =
  | "OK"
  | "ZERO_RESULTS"
  | "OVER_QUERY_LIMIT"
  | "REQUEST_DENIED"
  | "INVALID_REQUEST"
  | "UNKNOWN_ERROR";

export type UserLocation = {
  location: LatLng;
  displayAddress?: string | null;
  externalPlaceId?: string | null;
  radiusInKm?: number;
};

export type PlusCode = {
  compoundCode: string;
  globalCode: string;
};

export type GeocodeLocationRequest = {
  location: LatLng;
};

export type GeocodeResult = {
  placeId: string;
  formattedAddress: string;
  location: LatLng;
};

export type GeocodeLocationResponse = {
  results: GeocodeResult[];
  plusCode: PlusCode;
};

export type FormattableText = {
  text: string;
};

export type PlaceAutocompleteRequest = {
  input: string;
  languageCode: string;
  regionCode: string;
};

export type PlaceAutocompleteResponse = {
  suggestions: Suggestion[];
};

export type Suggestion = {
  placePrediction: PlacePredictionResponse;
};

export type PlacePrediction = {
  placeId: string;
  formattedAddress: string;
};

export type PlacePredictionResponse = {
  placeId: string;
  text: FormattableText;
};

export type PlaceDetailsRequest = {
  placeId: string;
};

export type PlaceDetails = {
  id: string;
  name: string;
  formattedAddress: string;
  location: LatLng;
  plusCode: PlusCode;
};

export type PlaceDetailsResponse = ApiResponse<PlaceDetails>;
