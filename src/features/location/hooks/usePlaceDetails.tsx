import type { PlaceDetails } from "@/src/features/location/services/googlePlaces.service";
import { GooglePlacesService } from "@/src/features/location/services/googlePlaces.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { LatLng } from "react-native-maps";

export const placeDetailsKey = (placeId: string) => ["googlePlaces", "placeDetails", placeId] as const;

export const placeFromLatLngKey = (loc: LatLng) => ["googlePlaces", "placeFromLatLng", loc.latitude.toFixed(6), loc.longitude.toFixed(6)] as const;

type Vars = {
  loc: LatLng;
  signal?: AbortSignal;
};

export function usePlaceDetailsFromLatLngMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ["googlePlaces", "placeFromLatLng", "mutation"],
    mutationFn: async ({ loc, signal }: Vars): Promise<PlaceDetails | null> => {
      return GooglePlacesService.getPlaceFromLatLng(loc, signal);
    },
    onSuccess: (data, vars) => {
      if (!data) return;

      qc.setQueryData(placeFromLatLngKey(vars.loc), data);
      qc.setQueryData(placeDetailsKey(data.placeId), data);
    },
  });
}
