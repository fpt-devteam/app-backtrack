import { Accuracy, getCurrentPositionAsync } from "expo-location";
import type { LatLng } from "react-native-maps";

function getGoogleApiKey(): string | null {
  const key = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;
  if (typeof key !== "string" || key.trim().length === 0) return null;
  return key.trim();
}

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

type GeocodeResponse = {
  readonly results: readonly {
    readonly place_id: string;
    readonly formatted_address: string;
    readonly address_components?: readonly {
      readonly long_name: string;
      readonly short_name: string;
      readonly types: readonly string[];
    }[];
  }[];
  readonly status: string;
};

function guessNameFromFormattedAddress(addr: string): string {
  const first = addr.split(",")[0]?.trim();
  return first || "Vị trí hiện tại";
}

let requestSequence = 0;

export const GooglePlacesService = {
  async autocomplete(
    input: string,
    signal?: AbortSignal
  ): Promise<readonly PlaceSuggestion[]> {
    if (!input.trim()) return [];

    const apiKey = getGoogleApiKey();
    if (!apiKey) {
      console.warn("Missing EXPO_PUBLIC_GOOGLE_API_KEY");
      return [];
    }

    const currentRequest = ++requestSequence;

    try {
      const params = new URLSearchParams({
        input: input.trim(),
        key: apiKey,
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
      const apiKey = getGoogleApiKey();
      if (!apiKey) {
        console.warn("Missing EXPO_PUBLIC_GOOGLE_API_KEY");
        return null;
      }

      const params = new URLSearchParams({
        place_id: placeId,
        fields: "place_id,name,formatted_address,geometry",
        key: apiKey,
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

  async getCurrentPlace(signal?: AbortSignal): Promise<PlaceDetails | null> {
    const apiKey = getGoogleApiKey();
    if (!apiKey) {
      console.warn("Missing EXPO_PUBLIC_GOOGLE_API_KEY");
      return null;
    }

    try {
      const pos = await getCurrentPositionAsync({ accuracy: Accuracy.Balanced });

      const coord: LatLng = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      };

      const params = new URLSearchParams({
        latlng: `${coord.latitude},${coord.longitude}`,
        key: apiKey,
        language: "vi",
        region: "vn",
      });

      const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?${params}`, { signal });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data: GeocodeResponse = await res.json();

      if (data.status !== "OK" || data.results.length === 0) {
        console.warn("Google Geocode error:", data.status);
        return null;
      }

      const top = data.results[0];
      const placeId = top.place_id;

      const details = await this.getPlaceDetails(placeId, signal);
      if (details) return details;

      const formattedAddress = top.formatted_address;
      return {
        placeId,
        name: guessNameFromFormattedAddress(formattedAddress),
        formattedAddress,
        location: coord,
      };
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return null;
      console.error("getCurrentPlace error:", error);
      return null;
    }
  },

  async getUserLocation() {
    try {
      const response = await getCurrentPositionAsync({
        accuracy: Accuracy.Balanced,
      });

      const location: LatLng = {
        latitude: response.coords.latitude,
        longitude: response.coords.longitude,
      };

      return location;
    } catch (error) {
      console.error('Failed to get current position:', error);
      return null;
    }
  },

  async getPlaceFromLatLng(
    location: LatLng,
    signal?: AbortSignal
  ): Promise<PlaceDetails | null> {
    const apiKey = getGoogleApiKey();
    if (!apiKey) {
      console.warn("Missing EXPO_PUBLIC_GOOGLE_API_KEY");
      return null;
    }

    try {
      const params = new URLSearchParams({
        latlng: `${location.latitude},${location.longitude}`,
        key: apiKey,
        language: "vi",
        region: "vn",
      });

      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?${params}`,
        { signal }
      );

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data: GeocodeResponse = await res.json();

      if (data.status !== "OK" || data.results.length === 0) {
        console.warn("Google Geocode error:", data.status);
        return null;
      }

      const top = data.results[0];
      const placeId = top.place_id;

      // Prefer Places Details if possible
      const details = await this.getPlaceDetails(placeId, signal);
      if (details) return details;

      // Fallback
      return {
        placeId,
        name: guessNameFromFormattedAddress(top.formatted_address),
        formattedAddress: top.formatted_address,
        location,
      };
    } catch (e) {
      if (e instanceof Error && e.name === "AbortError") return null;
      console.error("getPlaceFromLatLng error:", e);
      return null;
    }
  },
};
