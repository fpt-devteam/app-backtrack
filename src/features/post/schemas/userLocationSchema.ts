
import { LatLng } from "react-native-maps";
import * as yup from "yup";

/**
 * User Location Schema
 * This schema defines the validation rules for the user location field.
 */
const MIN_RADIUS_KM = 1;
const MAX_RADIUS_KM = 20;

export const userLocationSchema = yup.object({
  location: yup.mixed<LatLng>().required("Location is required!").test(
    "valid-lat-lng",
    "Invalid latitude and longitude values.",
    (value) => {
      if (!value) return false;
      const { latitude, longitude } = value;
      return (
        typeof latitude === "number" &&
        typeof longitude === "number" &&
        latitude >= -90 &&
        latitude <= 90 &&
        longitude >= -180 &&
        longitude <= 180
      );
    }
  ),
  displayAddress: yup.string().trim().nullable(),
  externalPlaceId: yup.string().trim().nullable(),
  radiusInKm: yup
    .number()
    .typeError("Radius must be a number.")
    .min(MIN_RADIUS_KM, `Radius must be at least ${MIN_RADIUS_KM} km.`)
    .max(MAX_RADIUS_KM, `Radius cannot exceed ${MAX_RADIUS_KM} km.`)
    .required("Radius is required."),
});
