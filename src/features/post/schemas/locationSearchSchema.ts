import { LatLng } from "react-native-maps";
import * as yup from "yup";

/**
 * Location Search Schema 
 * This schema defines the validation rules for the location search field.
 */

const DEFAULT_LOCATION: LatLng = {
  latitude: 10.84308399341188,
  longitude: 106.77177212981283,
};

export const locationSearchSchema = yup
  .mixed<LatLng>()
  .required("Location lat lng is required")
  .nullable()
  .notRequired()
  .default(DEFAULT_LOCATION);

export type LocationSearch = yup.InferType<typeof locationSearchSchema>;