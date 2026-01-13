import type { LatLng } from "react-native-maps";

export type UserLocation = {
  location: LatLng;
  displayAddress?: string | null;
  externalPlaceId?: string | null;
  radiusKm?: number;
};

export type PlaceSuggestion = {
  placeId: string;
  description: string;
};

export type PlaceDetails = {
  placeId: string;
  name: string;
  formattedAddress: string;
  location: LatLng;
};

export type AutocompleteResponse = {
  predictions: {
    place_id: string;
    description: string;
  }[];
  status: string;
};

export type PlaceDetailsResponse = {
  result: {
    place_id: string;
    name: string;
    formatted_address: string;
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
  };
  status: string;
};

export type GeocodeResponse = {
  results: {
    place_id: string;
    formatted_address: string;
    address_components?: {
      long_name: string;
      short_name: string;
      types: string[];
    }[];
  }[];
  status: string;
};