import type { Region } from "react-native-maps";

const DEFAULT_REGION: Region = {
  latitude: 10.762622,
  longitude: 106.660172,
  latitudeDelta: 0.03,
  longitudeDelta: 0.03,
};

const ANIMATE_TO_DURATION = 600;

const QUERY_CONFIG = {
  key: process.env.EXPO_PUBLIC_GOOGLE_API_KEY as string,
  language: "vi",
  components: "country:vn",
} as const;

export { ANIMATE_TO_DURATION, DEFAULT_REGION, QUERY_CONFIG };

