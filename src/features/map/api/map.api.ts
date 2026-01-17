
const PLACES_API_CONFIGS = {
  placeDetails: {
    url: (placeId: string) => `https://places.googleapis.com/v1/places/${placeId}`,
    fieldMask: 'id,displayName,location,plusCode,formattedAddress',
  },
  placeAutocomplete: {
    url: 'https://places.googleapis.com/v1/places:autocomplete',
    fieldMask: '*',
  },
} as const

const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY

export const googleMapService = {
  // Fetch place details by place ID
}