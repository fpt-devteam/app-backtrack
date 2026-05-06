export type AppImageSource =
  | string
  | number
  | { uri?: string | null }
  | null
  | undefined;

export const resolveAppImageSource = (
  source?: AppImageSource,
  url?: string | null,
) => {
  if (url) return { uri: url };
  if (typeof source === "string" && source) return { uri: source };
  if (typeof source === "number") return source;
  if (source && typeof source === "object" && source.uri) {
    return { uri: source.uri };
  }
  return undefined;
};
