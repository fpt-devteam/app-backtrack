import type {
  PlaceDetails,
  PlaceDetailsRequest,
} from "@/src/features/map/types";
import { publicClient } from "@/src/shared/api";
import { useMutation } from "@tanstack/react-query";

const API_CONFIG = {
  placeDetails: {
    url: (placeId: string) =>
      `https://places.googleapis.com/v1/places/${placeId}`,
    fieldMask: "id,displayName,location,plusCode,formattedAddress",
    mutationKey: ["place-details-mutation"] as const,
  },
} as const;

function getApiKey() {
  const key = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;
  return typeof key === "string" && key.trim().length > 0 ? key.trim() : null;
}

export const usePlaceDetails = () => {
  const mutation = useMutation<PlaceDetails, Error, PlaceDetailsRequest>({
    mutationKey: API_CONFIG.placeDetails.mutationKey,
    mutationFn: async ({ placeId }) => {
      const apiKey = getApiKey();
      if (!apiKey) throw new Error("Missing EXPO_PUBLIC_GOOGLE_API_KEY");

      const id = placeId?.trim();
      if (!id) throw new Error("placeId is required");

      const url = API_CONFIG.placeDetails.url(id);

      const res = await publicClient<PlaceDetails>(url, {
        method: "GET",
        headers: {
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": API_CONFIG.placeDetails.fieldMask,
        },
      });

      return res.data;
    },
  });

  return {
    getPlaceDetails: mutation.mutateAsync,
    mutate: mutation.mutate,
    data: mutation,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  };
};
