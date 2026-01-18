import type {
  PlaceAutocompleteRequest,
  PlaceAutocompleteResponse,
  PlacePrediction,
} from "@/src/features/map/types";
import { publicClient } from "@/src/shared/api";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

const DEBOUNCE_MS_DEFAULT = 350;
const MIN_QUERY_LENGTH = 1;

const API_CONFIG = {
  placeAutocomplete: {
    url: "https://places.googleapis.com/v1/places:autocomplete",
    fieldMask: "*",
    queryKey: ["place-autocomplete"] as const,
  },
} as const;

type PlaceAutocompleteOptions = {
  searchQuery: string;
  enabled?: boolean;
  debounceMs?: number;
  minQueryLength?: number;
};

function useDebouncedValue<T>(value: T, delayMs: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
}

export const usePlaceAutocomplete = ({
  searchQuery,
  enabled = true,
  debounceMs = DEBOUNCE_MS_DEFAULT,
  minQueryLength = MIN_QUERY_LENGTH,
}: PlaceAutocompleteOptions) => {
  const debounced = useDebouncedValue(searchQuery, debounceMs);

  const debouncedQuery = useMemo(() => {
    return debounced.trim().replace(/\s+/g, " ");
  }, [debounced]);

  const canFetch = enabled && debouncedQuery.length >= minQueryLength;

  const query = useQuery<PlacePrediction[]>({
    queryKey: [API_CONFIG.placeAutocomplete.queryKey, { q: debouncedQuery }],
    enabled: canFetch,
    queryFn: async () => {
      const apiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;
      if (!apiKey) {
        console.warn("Missing EXPO_PUBLIC_GOOGLE_API_KEY");
        return [] as PlacePrediction[];
      }

      const url = API_CONFIG.placeAutocomplete.url;
      const req: PlaceAutocompleteRequest = {
        input: debouncedQuery,
        languageCode: "vi",
        regionCode: "vn",
      };

      const res = await publicClient.post(url, req, {
        headers: {
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": API_CONFIG.placeAutocomplete.fieldMask,
          "Content-Type": "application/json",
        },
      });

      const resData: PlaceAutocompleteResponse = res.data;
      const predictions: PlacePrediction[] = resData.suggestions.map((s) => ({
        placeId: s.placePrediction.placeId,
        formattedAddress: s.placePrediction.text.text,
      }));

      return predictions;
    },
  });

  return {
    loading: query.isLoading,
    predictions: query.data || [],
    error: query.isError,
  };
};
