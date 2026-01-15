import { publicClient } from '@/src/api/common'
import type { PlaceAutocompleteResponse, PlaceSuggestion } from '@/src/features/map/types'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'

type PlaceAutocompleteOptions = {
  searchQuery: string,
  enabled?: boolean
  debounceMs?: number
  minQueryLength?: number
}

function useDebouncedValue<T>(value: T, delayMs: number) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(t)
  }, [value, delayMs])
  return debounced
}

const GOOGLE_PLACES_API_URL = 'https://maps.googleapis.com/maps/api/place/autocomplete/json'
const DEBOUNCE_MS_DEFAULT = 350
const MIN_QUERY_LENGTH = 1

const usePlaceAutocomplete = ({
  searchQuery,
  enabled = true,
  debounceMs = DEBOUNCE_MS_DEFAULT,
  minQueryLength = MIN_QUERY_LENGTH
}: PlaceAutocompleteOptions) => {
  const debounced = useDebouncedValue(searchQuery, debounceMs)

  const debouncedQuery = useMemo(() => {
    return debounced.trim().replace(/\s+/g, ' ')
  }, [debounced])

  const canFetch = enabled && debouncedQuery.length >= minQueryLength

  const query = useQuery<PlaceSuggestion[]>({
    queryKey: ['place-autocomplete', { q: debouncedQuery }],
    enabled: canFetch,
    queryFn: async () => {
      const apiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY
      if (!apiKey) {
        console.warn("Missing EXPO_PUBLIC_GOOGLE_API_KEY")
        return [] as PlaceSuggestion[]
      }

      const params = new URLSearchParams({
        input: searchQuery.trim(),
        key: apiKey,
        language: "vi",
        components: "country:vn",
      })

      const response = await publicClient<PlaceAutocompleteResponse>(`${GOOGLE_PLACES_API_URL}?${params}`)
      if (!(response.data.status === 'OK' || response.data.status === 'ZERO_RESULTS')) {
        console.warn("Google Places Autocomplete error:", response.data.status)
        return [] as PlaceSuggestion[]
      }

      const predictions: PlaceSuggestion[] = response.data.predictions.map(prediction => ({
        placeId: prediction.place_id,
        description: prediction.description,
      }))

      return predictions
    }
  })

  return {
    loading: query.isLoading,
    suggestions: query.data || [],
    error: query.isError,
  }
}

export default usePlaceAutocomplete