import { toast } from "@/src/shared/components/ui/toast";
import { ensureLocationPermission, getErrorMessage } from "@/src/shared/utils";
import { useMutation } from "@tanstack/react-query";
import { Accuracy, getCurrentPositionAsync } from "expo-location";
import { useMemo } from "react";
import type { LatLng } from "react-native-maps";

const API_CONFIG = {
  getUserCoordinates: {
    queryKey: ["get-user-coordinates"] as const,
  },
} as const;

export const useUserCoordinates = () => {
  const mutation = useMutation({
    mutationKey: API_CONFIG.getUserCoordinates.queryKey,
    mutationFn: async () => {
      const hasPermission = await ensureLocationPermission();
      if (!hasPermission) {
        console.log("Location permission not granted");
        return null;
      }

      const apiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;
      if (!apiKey) {
        console.log("Missing EXPO_PUBLIC_GOOGLE_API_KEY");
        return null;
      }

      const position = await getCurrentPositionAsync({
        accuracy: Accuracy.Balanced,
      });

      const coord: LatLng = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      return coord;
    },

    onError: (err) => {
      toast.error("Get user coordinates failed", getErrorMessage(err));
    },
  });

  const errorMessage = useMemo(() => {
    if (!mutation.error) return null;
    return mutation.error?.message ?? "Unknown error";
  }, [mutation.error]);

  return {
    getUserCoordinates: mutation.mutateAsync,
    loading: mutation.isPending,
    error: errorMessage,
  };
};
