import type { Post } from "@/src/features/post/types";
import { POST_ROUTE } from "@/src/shared/constants";
import { colors } from "@/src/shared/theme";
import { formatShortEventTime } from "@/src/shared/utils/datetime.utils";
import { router } from "expo-router";
import { ClockIcon, MapPinIcon } from "phosphor-react-native";
import React, { useCallback, useMemo } from "react";
import {
  Image,
  Pressable,
  Text,
  View,
} from "react-native";
import { PostStatusBadge } from "./PostStatusBadge";

type PostCardProps = {
  item: Post;
};

export const PostCard = ({ item }: PostCardProps) => {
  const imageUrl = item.images?.[0]?.url;

  // "Jan 15 · 14:30" — date + time, more scannable than date-only
  const eventTimeLabel = useMemo(
    () => formatShortEventTime(item.eventTime),
    [item.eventTime]
  );

  const locationLabel = useMemo(() => {
    if (item.displayAddress?.trim()) return item.displayAddress;
    if (item.location?.latitude != null && item.location?.longitude != null) {
      return `${item.location.latitude.toFixed(4)}, ${item.location.longitude.toFixed(4)}`;
    }
    return "Unknown location";
  }, [item.displayAddress, item.location?.latitude, item.location?.longitude]);

  const handleOpenDetail = useCallback(() => {
    router.push(POST_ROUTE.details(item.id));
  }, [item.id]);

  return (
    <Pressable
      onPress={handleOpenDetail}
      style={({ pressed }) => ({
        borderRadius: 8,                   // matches app's rounded-lg
        overflow: "hidden",
        backgroundColor: colors.card,      // white
        // Tokopedia/Lazada-style: barely-there shadow, no border
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
        opacity: pressed ? 0.88 : 1,
      })}
    >
      {/* ── IMAGE ─────────────────────────────────────────────────
          Full-bleed, cover — identical to Tokopedia/Lazada.
          Fixed pixel height so it never fights the info section.
      ──────────────────────────────────────────────────────────── */}
      <View
        style={{
          width: "100%",
          height: 200,
          backgroundColor: colors.slate[100],  // neutral placeholder
        }}
      >
        {imageUrl && (
          <Image
            resizeMode="cover"
            style={{ width: "100%", height: "100%" }}
            source={{ uri: imageUrl }}
          />
        )}

        {/* Lost / Found badge — top-left corner of image, Tokopedia badge style */}
        <View style={{ position: "absolute", top: 6, left: 6 }}>
          <PostStatusBadge status={item.postType} size="sm" />
        </View>
      </View>

      {/* ── INFO STRIP ────────────────────────────────────────────
          Mirrors ecommerce card info density:
            • Item name  = product name  (2 lines, weight 400)
            • Event time = price         (bold, colors.primary)
            • Location   = "sold/rating" (muted, smallest)

          colors.primary (sky-500) is used for the "price" row —
          consistent with every other interactive element in the app.
      ──────────────────────────────────────────────────────────── */}
      <View
        style={{
          width: "100%",
          paddingHorizontal: 8,
          paddingTop: 7,
          paddingBottom: 7,
          backgroundColor: colors.card,
          justifyContent: "space-between",
        }}
      >
        {/* Item name — 2 lines, matches Tokopedia product title styling */}
        <Text
          numberOfLines={2}
          style={{
            fontSize: 12,
            fontWeight: "400",
            color: colors.foreground,          // slate-900
            lineHeight: 17,
          }}
        >
          {item.itemName}
        </Text>

        {/* Event time — the "price" row: bold, app primary sky-blue */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <ClockIcon size={11} color={colors.primary} weight="fill" />
          <Text
            numberOfLines={1}
            style={{
              fontSize: 13,
              fontWeight: "700",
              color: colors.primary,           // sky-500, consistent with app
            }}
          >
            {eventTimeLabel}
          </Text>
        </View>

        {/* Location — the "sold / rating" row: muted, smallest */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
          <MapPinIcon size={10} color={colors.slate[300]} weight="fill" />
          <Text
            numberOfLines={1}
            style={{ flex: 1, fontSize: 10, color: colors.text.muted }}
          >
            {locationLabel}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};
