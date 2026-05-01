import { Image } from "expo-image";
import React, { useMemo } from "react";
import type { ImageStyle, StyleProp } from "react-native";

type AppImageSource = string | { uri?: string | null } | null | undefined;

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

type LegacyResizeMode = "cover" | "contain" | "stretch" | "center";

type AppImageProps = {
  url?: string | null;
  source?: AppImageSource;
  contentFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  resizeMode?: LegacyResizeMode;
  width?: number;
  height?: number;
  style?: StyleProp<ImageStyle>;
  className?: string;
  blurRadius?: number;
  isBlurred?: boolean;
};

const mapResizeModeToContentFit = (
  resizeMode?: LegacyResizeMode,
): AppImageProps["contentFit"] => {
  if (resizeMode === "stretch") return "fill";
  if (resizeMode === "center") return "contain";
  return resizeMode;
};

export const AppImage = ({
  url,
  source,
  contentFit,
  resizeMode,
  width,
  height,
  style,
  isBlurred = false,
}: AppImageProps) => {
  const resolvedSource = useMemo(() => {
    if (url) return { uri: url };
    if (typeof source === "string" && source) return { uri: source };
    if (source && typeof source === "object" && source.uri) {
      return { uri: source.uri };
    }
    return undefined;
  }, [source, url]);

  const resolvedContentFit =
    contentFit ?? mapResizeModeToContentFit(resizeMode) ?? "cover";

  return (
    <Image
      source={resolvedSource}
      contentFit={resolvedContentFit}
      style={[
        style,
        width != null || height != null ? { width, height } : undefined,
      ]}
      blurRadius={isBlurred ? 300 : 0}
      cachePolicy={"memory-disk"}
      placeholder={{ blurhash }}
      transition={1000}
    />
  );
};
