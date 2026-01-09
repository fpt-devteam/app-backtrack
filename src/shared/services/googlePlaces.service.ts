import type { LatLng } from "react-native-maps";

const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY as string;

export type PlaceSuggestion = {
  readonly placeId: string;
  readonly description: string;
};

export type PlaceDetails = {
  readonly placeId: string;
  readonly name: string;
  readonly formattedAddress: string;
  readonly location: LatLng;
};

type AutocompleteResponse = {
  readonly predictions: readonly {
    readonly place_id: string;
    readonly description: string;
  }[];
  readonly status: string;
};

type PlaceDetailsResponse = {
  readonly result: {
    readonly place_id: string;
    readonly name: string;
    readonly formatted_address: string;
    readonly geometry: {
      readonly location: {
        readonly lat: number;
        readonly lng: number;
      };
    };
  };
  readonly status: string;
};

let requestSequence = 0;

export const GooglePlacesService = {
  async autocomplete(
    input: string,
    signal?: AbortSignal
  ): Promise<readonly PlaceSuggestion[]> {
    if (!input.trim()) return [];

    const currentRequest = ++requestSequence;

    try {
      const params = new URLSearchParams({
        input: input.trim(),
        key: GOOGLE_API_KEY,
        language: "vi",
        components: "country:vn",
      });

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?${params}`,
        { signal }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: AutocompleteResponse = await response.json();

      // Ignore if this is not the latest request
      if (currentRequest !== requestSequence) {
        return [];
      }

      if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
        console.warn("Google Places Autocomplete error:", data.status);
        return [];
      }

      return data.predictions.map((p) => ({
        placeId: p.place_id,
        description: p.description,
      }));
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return [];
      }
      console.error("Google Places Autocomplete error:", error);
      return [];
    }
  },

  async getPlaceDetails(
    placeId: string,
    signal?: AbortSignal
  ): Promise<PlaceDetails | null> {
    try {
      const params = new URLSearchParams({
        place_id: placeId,
        fields: "place_id,name,formatted_address,geometry",
        key: GOOGLE_API_KEY,
        language: "vi",
      });

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?${params}`,
        { signal }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: PlaceDetailsResponse = await response.json();

      if (data.status !== "OK") {
        console.warn("Google Places Details error:", data.status);
        return null;
      }

      return {
        placeId: data.result.place_id,
        name: data.result.name,
        formattedAddress: data.result.formatted_address,
        location: {
          latitude: data.result.geometry.location.lat,
          longitude: data.result.geometry.location.lng,
        },
      };
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return null;
      }
      console.error("Google Places Details error:", error);
      return null;
    }
  },
};
