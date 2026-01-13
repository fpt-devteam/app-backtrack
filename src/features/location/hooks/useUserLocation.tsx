import { HOOK_QUERY_KEY } from '@/src/features/location/constants'
import type { GeocodeResponse, UserLocation } from '@/src/features/location/types'
import type { Nullable } from '@/src/shared/types'
import { useMutation } from '@tanstack/react-query'
import { Accuracy, getCurrentPositionAsync } from 'expo-location'
import { useMemo } from 'react'
import type { LatLng } from 'react-native-maps'

const useUserLocation = () => {
  const mutation = useMutation<Nullable<UserLocation>>({
    mutationKey: HOOK_QUERY_KEY.getUserLocation,
    mutationFn: async () => {
      const apiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;
      if (!apiKey) {
        console.warn("Missing EXPO_PUBLIC_GOOGLE_API_KEY");
        return null;
      }

      const position = await getCurrentPositionAsync({ accuracy: Accuracy.Balanced });
      const coord: LatLng = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      const params = new URLSearchParams({
        latlng: `${coord.latitude},${coord.longitude}`,
        key: apiKey,
        language: "vi",
        region: "vn",
      });

      const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?${params}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data: GeocodeResponse = await res.json();
      if (data.status !== "OK" || data.results.length === 0) {
        console.warn("Google Geocode error:", data.status);
        return null;
      }

      const top = data.results[0];
      const placeId = top.place_id;
      const formattedAddress = top.formatted_address;

      const userLocation: UserLocation = {
        location: coord,
        displayAddress: formattedAddress,
        externalPlaceId: placeId,
      }

      console.log("User location fetched at hook:", userLocation)
      return userLocation;
    },

    onError: (err) => {
      console.log('Get user location failed:', err?.message)
    },
  })

  const errorMessage = useMemo(() => {
    if (!mutation.error) return null
    return mutation.error?.message ?? 'Unknown error'
  }, [mutation.error])

  return {
    getUserLocation: mutation.mutateAsync,
    loadingUserLocation: mutation.isPending,
    error: errorMessage,
  }
}

export default useUserLocation
