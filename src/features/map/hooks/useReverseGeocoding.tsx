import {
  GeocodeLocationRequest,
  GeocodeLocationResponse,
  GeocodeResult,
} from "@/src/features/map/types";
import { publicClient } from "@/src/shared/api";
import { useMutation } from "@tanstack/react-query";
import type { LatLng } from "react-native-maps";

const API_CONFIG = {
  reverseGeocodeLocation: {
    url: (location: LatLng) =>
      `https://geocode.googleapis.com/v4beta/geocode/location/${location.latitude},${location.longitude}`,
    params: {
      key: process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
      languageCode: "vi",
      regionCode: "VN",
    },
    mutationKey: ["reverse-geocode-location-mutation"] as const,
  },
} as const;

function getApiKey() {
  const key = API_CONFIG.reverseGeocodeLocation.params.key;
  return typeof key === "string" && key.trim().length > 0 ? key.trim() : null;
}

export const useReverseGeocoding = () => {
  const mutation = useMutation<GeocodeResult, Error, GeocodeLocationRequest>({
    mutationKey: API_CONFIG.reverseGeocodeLocation.mutationKey,
    mutationFn: async (request: GeocodeLocationRequest) => {
      const apiKey = getApiKey();
      if (!apiKey) throw new Error("Missing EXPO_PUBLIC_GOOGLE_API_KEY");

      const url = API_CONFIG.reverseGeocodeLocation.url(request.location);
      const params = new URLSearchParams({
        key: apiKey,
        languageCode: API_CONFIG.reverseGeocodeLocation.params.languageCode,
        regionCode: API_CONFIG.reverseGeocodeLocation.params.regionCode,
      });

      const res = await publicClient.get<GeocodeLocationResponse>(
        `${url}?${params.toString()}`,
      );

      const resData = res.data;

      return {
        placeId: resData.results?.[0]?.placeId ?? "",
        formattedAddress: resData.results?.[0]?.formattedAddress ?? "",
        location: request.location,
      } as GeocodeResult;
    },
  });

  return {
    reverseGeocode: mutation.mutateAsync,
    mutate: mutation.mutate,

    data: mutation.data,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  };
};
