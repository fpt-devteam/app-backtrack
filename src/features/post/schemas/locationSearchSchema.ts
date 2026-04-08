import { LatLng } from "react-native-maps";
import * as yup from "yup";

/**
 * Location Search Schema 
 * This schema defines the validation rules for the location search field.
 */
export const locationSearchSchema = yup
  .mixed<LatLng>()
  .required("Location lat lng is required")
  .nullable()
  .notRequired()
  .default(undefined);

export type LocationSearch = yup.InferType<typeof locationSearchSchema>;