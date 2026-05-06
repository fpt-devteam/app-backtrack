import { Image } from "expo-image";
import React, { useMemo } from "react";
import type { ImageStyle, StyleProp } from "react-native";

import {
  resolveAppImageSource,
  type AppImageSource,
} from "./app-image.utils";

const _blurhash =
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
  isBlurred: _isBlurred = false,
}: AppImageProps) => {
  const resolvedSource = useMemo(
    () => resolveAppImageSource(source, url),
    [source, url],
  );

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
      // blurRadius={isBlurred ? 300 : 0}
      cachePolicy={"memory-disk"}
      // placeholder={{ blurhash }}
      transition={1000}
    />
  );
};
