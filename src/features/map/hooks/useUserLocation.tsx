import type { UserLocation } from "@/src/features/map/types";
import {
  IS_LOCATION_MOCK_ENABLED,
  MOCK_LOCATION,
} from "@/src/shared/mocks/location.mock";
import type { Nullable } from "@/src/shared/types";
import { ensureLocationPermission } from "@/src/shared/utils/location.utils";
import { useMutation } from "@tanstack/react-query";
import { Accuracy, getCurrentPositionAsync } from "expo-location";
import { useMemo } from "react";
import type { LatLng } from "react-native-maps";
import { DEFAULT_RADIUS_KM } from "../constants";
import { useReverseGeocoding } from "./useReverseGeocoding";

const API_CONFIG = {
  getUserLocation: {
    queryKey: ["get-user-location"] as const,
  },
} as const;

export const useUserLocation = () => {
  const { reverseGeocode } = useReverseGeocoding();

  const mutation = useMutation<Nullable<UserLocation>>({
    mutationKey: API_CONFIG.getUserLocation.queryKey,
    mutationFn: async () => {
      const hasPermission = await ensureLocationPermission();
      if (!hasPermission) {
        return null;
      }

      if (IS_LOCATION_MOCK_ENABLED) return MOCK_LOCATION;

      const apiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;
      if (!apiKey) {
        console.warn("Missing EXPO_PUBLIC_GOOGLE_API_KEY");
        return null;
      }

      const position = await getCurrentPositionAsync({
        accuracy: Accuracy.Balanced,
      });

      const coord: LatLng = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      const geocodeResult = await reverseGeocode({ location: coord });

      const userLocation: UserLocation = {
        location: coord,
        displayAddress: geocodeResult?.formattedAddress,
        externalPlaceId: geocodeResult?.placeId,
        radiusInKm: DEFAULT_RADIUS_KM,
      };

      return userLocation;
    },

    onError: (err) => {
      console.log("Get user location failed:", err?.message);
    },
  });

  const errorMessage = useMemo(() => {
    if (!mutation.error) return null;
    return mutation.error?.message ?? "Unknown error";
  }, [mutation.error]);

  return {
    getUserLocation: mutation.mutateAsync,
    loadingUserLocation: mutation.isPending,
    error: errorMessage,
  };
};
