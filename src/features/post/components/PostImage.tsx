import type { PostSubcategoryCode } from "@/src/features/post/types";
import {
  CARD_SUB_CATEGORY_ICONS,
  ELECTRONICS_SUB_CATEGORY_ICONS,
  OTHERS_ICON,
  PERSONAL_BELONGING_SUB_CATEGORY_ICONS,
} from "@/src/shared/constants";
import React, { useMemo } from "react";
import type { ImageStyle, StyleProp } from "react-native";
import { AppImage } from "@/src/shared/components";

import {
  getPostImageFallbackKey,
  type PostImageFallbackKey,
} from "./post-image.utils";

type LegacyResizeMode = "cover" | "contain" | "stretch" | "center";

type PostImageProps = {
  url?: string | null;
  subcategoryCode?: PostSubcategoryCode;
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
): PostImageProps["contentFit"] => {
  if (resizeMode === "stretch") return "fill";
  if (resizeMode === "center") return "contain";
  return resizeMode;
};

const POST_IMAGE_FALLBACK_SOURCE_BY_KEY: Record<PostImageFallbackKey, number> = {
  BANK_CARD: CARD_SUB_CATEGORY_ICONS.BANK_CARD,
  COMPANY_CARD: CARD_SUB_CATEGORY_ICONS.COMPANY_CARD,
  DRIVER_LICENSE: CARD_SUB_CATEGORY_ICONS.DRIVER_LICENSE,
  IDENTIFICATION_CARD: CARD_SUB_CATEGORY_ICONS.IDENTIFICATION_CARD,
  PASSPORT: CARD_SUB_CATEGORY_ICONS.PASSPORT,
  PERSONAL_CARD: CARD_SUB_CATEGORY_ICONS.PERSONAL_CARD,
  STUDENT_CARD: CARD_SUB_CATEGORY_ICONS.STUDENT_CARD,
  CHARGER_ADAPTER: ELECTRONICS_SUB_CATEGORY_ICONS.CHARGER_ADAPTER,
  EARPHONE: ELECTRONICS_SUB_CATEGORY_ICONS.EARPHONE,
  HEADPHONE: ELECTRONICS_SUB_CATEGORY_ICONS.HEADPHONE,
  KEYBOARD: ELECTRONICS_SUB_CATEGORY_ICONS.KEYBOARD,
  LAPTOP: ELECTRONICS_SUB_CATEGORY_ICONS.LAPTOP,
  MOUSE: ELECTRONICS_SUB_CATEGORY_ICONS.MOUSE,
  PHONE: ELECTRONICS_SUB_CATEGORY_ICONS.PHONE,
  POWER_OUTLET: ELECTRONICS_SUB_CATEGORY_ICONS.POWER_OUTLET,
  POWERBANK: ELECTRONICS_SUB_CATEGORY_ICONS.POWERBANK,
  SMART_WATCH: ELECTRONICS_SUB_CATEGORY_ICONS.SMART_WATCH,
  BACKPACK: PERSONAL_BELONGING_SUB_CATEGORY_ICONS.BACKPACK,
  CLOTHINGS: PERSONAL_BELONGING_SUB_CATEGORY_ICONS.CLOTHINGS,
  JEWELRY: PERSONAL_BELONGING_SUB_CATEGORY_ICONS.JEWELRY,
  KEYS: PERSONAL_BELONGING_SUB_CATEGORY_ICONS.KEYS,
  SUITCASES: PERSONAL_BELONGING_SUB_CATEGORY_ICONS.SUITCASES,
  WALLETS: PERSONAL_BELONGING_SUB_CATEGORY_ICONS.WALLETS,
  OTHERS: OTHERS_ICON,
};

export const PostImage = ({
  url,
  subcategoryCode,
  contentFit,
  resizeMode,
  width,
  height,
  style,
  className,
  blurRadius,
  isBlurred = false,
}: PostImageProps) => {
  const resolvedSource = useMemo(() => {
    const normalizedUrl = url?.trim();
    if (normalizedUrl) return { uri: normalizedUrl };

    const fallbackKey = getPostImageFallbackKey(subcategoryCode);
    return POST_IMAGE_FALLBACK_SOURCE_BY_KEY[fallbackKey];
  }, [subcategoryCode, url]);

  const resolvedContentFit =
    contentFit ?? mapResizeModeToContentFit(resizeMode) ?? "cover";

  return (
    <AppImage
      source={resolvedSource}
      contentFit={resolvedContentFit}
      className={className}
      style={[
        style,
        width != null || height != null ? { width, height } : undefined,
      ]}
      blurRadius={isBlurred ? (blurRadius ?? 300) : blurRadius}
      isBlurred={isBlurred}
    />
  );
};
