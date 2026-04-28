import type { UserLocation } from "@/src/features/map/types";
import { toast } from "@/src/shared/components/ui/toast";
import type { Nullable } from "@/src/shared/types";
import { ensureLocationPermission } from "@/src/shared/utils/location.utils";
import { useMutation } from "@tanstack/react-query";
import { Accuracy, getCurrentPositionAsync } from "expo-location";
import { useMemo } from "react";
import type { LatLng } from "react-native-maps";
import { DEFAULT_RADIUS_KM } from "../constants";

const API_CONFIG = {
  getUserLocation: {
    queryKey: ["get-user-location"] as const,
  },
} as const;

const MOCK_LOCATION: UserLocation = {
  displayAddress:
    "702 Võ Nguyên Giáp, Hiệp Phú, Tăng Nhơn Phú, Hồ Chí Minh 70000, Việt Nam",
  externalPlaceId: "ChIJm0qMwQkndTERc5s0xiK131M",
  location: {
    latitude: 10.84308399341188,
    longitude: 106.77177212981283,
  },
  radiusInKm: DEFAULT_RADIUS_KM,
};

export const useUserLocation = () => {
  const mutation = useMutation<Nullable<UserLocation>>({
    mutationKey: API_CONFIG.getUserLocation.queryKey,
    mutationFn: async () => {
      const hasPermission = await ensureLocationPermission();
      if (!hasPermission) return null;

      if (__DEV__) return MOCK_LOCATION;

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

      const userLocation: UserLocation = {
        location: coord,
        radiusInKm: DEFAULT_RADIUS_KM,
      };

      return userLocation;
    },

    onError: (err) => {
      if (err?.message === "PERMISSION_DENIED") {
        toast.error(
          "Location Access Required",
          "Please enable location permissions in your phone settings to use this feature.",
        );
      } else {
        toast.error(
          "Unable to find you",
          "Please check if your device's GPS is turned on and try again.",
        );
      }
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
