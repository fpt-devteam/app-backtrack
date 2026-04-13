import { DEFAULT_RADIUS_KM } from "@/src/features/map/constants";
import { UserLocation } from "@/src/features/map/types";

export const IS_LOCATION_MOCK_ENABLED = true;

export const MOCK_LOCATION: UserLocation = {
  displayAddress:
    "702 Võ Nguyên Giáp, Hiệp Phú, Tăng Nhơn Phú, Hồ Chí Minh 70000, Việt Nam",
  externalPlaceId: "ChIJm0qMwQkndTERc5s0xiK131M",
  location: {
    latitude: 10.84308399341188,
    longitude: 106.77177212981283,
  },
  radiusInKm: DEFAULT_RADIUS_KM,
};