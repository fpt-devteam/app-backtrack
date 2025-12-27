import { LatLng } from "react-native-maps";

export type GoogleMapDetailLocation = {
  location: LatLng;
  displayAddress?: string | null;
  externalPlaceId?: string | null;
};

export const GeocodingStatusValue = {
  OK: 'OK',
  ZERO_RESULTS: 'ZERO_RESULTS',
  OVER_DAILY_LIMIT: 'OVER_DAILY_LIMIT',
  OVER_QUERY_LIMIT: 'OVER_QUERY_LIMIT',
  REQUEST_DENIED: 'REQUEST_DENIED',
  INVALID_REQUEST: 'INVALID_REQUEST',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
};

export type GeocodingStatus = typeof GeocodingStatusValue[keyof typeof GeocodingStatusValue];

export type AddressComponent = {
  long_name: string;
  short_name: string;
  types: string[];
};

export type Viewport = {
  northeast: LatLng;
  southwest: LatLng;
};

export type Bounds = {
  northeast: LatLng;
  southwest: LatLng;
};

export type LocationType =
  | 'ROOFTOP'
  | 'RANGE_INTERPOLATED'
  | 'GEOMETRIC_CENTER'
  | 'APPROXIMATE';

export type Geometry = {
  location: LatLng;
  location_type: LocationType;
  viewport: Viewport;
  bounds?: Bounds;
};

export type PlusCode = {
  global_code: string;
  compound_code?: string;
};

export type GeocodingResult = {
  address_components: AddressComponent[];
  formatted_address: string;
  geometry: Geometry;
  place_id: string;
  types: string[];
  plus_code?: PlusCode;
  partial_match?: boolean;
  postcode_localities?: string[];
};

export type GeocodingResponse = {
  results: GeocodingResult[];
  status: GeocodingStatus;
  error_message?: string;
};
