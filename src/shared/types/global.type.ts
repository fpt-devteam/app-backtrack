export type Nullable<T> = T | null;

export type LocationFilterValue = {
  lat: number;
  lng: number;
  radius: number;
  label?: string;
  placeId?: string;
};
