import {
  GooglePlacesService,
  type PlaceSuggestion,
} from "@/src/shared/services";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

function useDebouncedValue<T>(value: T, delayMs: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
}

export function useLocationSearch(query: string, enabled: boolean) {
  const debouncedQuery = useDebouncedValue(query, 350);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const queryResult = useQuery<readonly PlaceSuggestion[]>({
    queryKey: ["location-autocomplete", debouncedQuery],
    queryFn: async () => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      const trimmed = debouncedQuery.trim();
      if (!trimmed) return [];

      return await GooglePlacesService.autocomplete(
        trimmed,
        abortControllerRef.current.signal
      );
    },
    enabled: enabled && debouncedQuery.trim().length > 0,
    placeholderData: (previous) => previous ?? [],
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return { ...queryResult, debouncedQuery };
}
