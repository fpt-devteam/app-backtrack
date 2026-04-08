import * as yup from "yup";

/**
 * Radius Search Schema 
 * This schema defines the validation rules for the Radius search field.
 */

const DEFAULT_RADIUS = 20;

export const radiusSearchSchema = yup
  .number()
  .min(1, "Radius must be at least 1 km!")
  .max(20, "Radius cannot exceed 20 km!")
  .required("Radius is required!")
  .default(DEFAULT_RADIUS);

export type RadiusSearch = yup.InferType<typeof radiusSearchSchema>;