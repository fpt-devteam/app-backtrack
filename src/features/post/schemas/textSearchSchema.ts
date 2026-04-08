import * as yup from "yup";

/**
 * Text Search Schema
 * This schema defines the validation rules for the text search field.
 */

const CONSTANTS = {
  MIN_LENGTH: 2,
  MAX_LENGTH: 100,
}

const ERROR = {
  TEXT_SEARCH_REQUIRED: "Text search is required!",
  TEXT_SEARCH_TOO_SHORT: `Text search must be at least ${CONSTANTS.MIN_LENGTH} characters!`,
  TEXT_SEARCH_TOO_LONG: `Text search must be less than ${CONSTANTS.MAX_LENGTH} characters!`,
}

export const textSearchSchema = yup
  .string()
  .trim()
  .transform((value) => (value === "" ? null : value))
  .nullable()
  .notRequired()
  .min(CONSTANTS.MIN_LENGTH, ERROR.TEXT_SEARCH_TOO_SHORT)
  .max(CONSTANTS.MAX_LENGTH, ERROR.TEXT_SEARCH_TOO_LONG)
  .default(undefined);

export type TextSearch = yup.InferType<typeof textSearchSchema>;