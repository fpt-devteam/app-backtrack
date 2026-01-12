import type { LatLng } from "react-native-maps";

export type UserLocation = {
  location: LatLng;
  displayAddress?: string;
  externalPlaceId?: string;
  radiusKm?: number;
};
