import { Nullable } from "@/src/shared/types";

/**
 * Converts the first character of a string to uppercase.
 *
 * @param value Input string to normalize.
 * @returns A new string with the first character uppercased.
 * Returns an empty string when `value` is empty.
 * Leaves the rest of the string unchanged.
 */
export const toTitleCase = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

/**
 * Returns trimmed display-safe text with a fallback.
 *
 * @param value Optional text value that may be null, undefined, or whitespace.
 * @returns The trimmed text when `value` contains non-whitespace characters.
 * Returns `"Not specified"` when `value` is null, undefined, empty, or whitespace-only.
 */
export const getSafeText = (value: Nullable<string>) => {
  const normalized = value?.trim();
  return normalized || "Not specified";
};