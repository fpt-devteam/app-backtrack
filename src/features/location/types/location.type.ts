import type { LatLng } from "react-native-maps";

export type UserLocation = {
  location: LatLng;
  displayAddress?: string | null;
  externalPlaceId?: string | null;
  radiusKm?: number;
};
