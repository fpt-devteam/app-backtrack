import { Nullable } from "@/src/shared/types";
import { LatLng } from "react-native-maps";
import { StateCreator } from "zustand";

export type AppLocation = {
  coords: LatLng,
  address: Nullable<string>,
  placeId: Nullable<string>,
}

const DEFAULT_LOCATION: AppLocation = {
  address:
    "702 Võ Nguyên Giáp, Hiệp Phú, Tăng Nhơn Phú, Hồ Chí Minh 70000, Việt Nam",
  placeId: "ChIJm0qMwQkndTERc5s0xiK131M",
  coords: {
    latitude: 10.84308399341188,
    longitude: 106.77177212981283,
  },
};

export type LocationSlice = {
  location: AppLocation;
  setLocation: (location: AppLocation) => void;
  resetLocationSlice: () => void;
}

export const createLocationSlice: StateCreator<LocationSlice> = (set) => ({
  location: DEFAULT_LOCATION,
  setLocation: (location) => set({ location }),
  resetLocationSlice: () => set({ location: DEFAULT_LOCATION }),
});