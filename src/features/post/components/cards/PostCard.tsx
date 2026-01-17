import { PostStatusBadge } from "@/src/features/post/components/badges/PostStatusBadge";
import type { Post } from "@/src/features/post/types";
import { POST_ROUTE } from "@/src/shared/constants";
import { colors } from "@/src/shared/theme";
import { formatIsoDate } from "@/src/shared/utils";
import type { ExternalPathString, RelativePathString } from "expo-router";
import { router } from "expo-router";
import { ClockIcon, MapPinIcon } from "phosphor-react-native";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { DimensionValue } from "react-native";
import { Animated, Easing, Image, Pressable, Text, View } from "react-native";

type CardType = "vertical" | "horizontal";

const CardConfigs: Record<CardType, {
  card: {
    width: DimensionValue;
    height: DimensionValue
  }
}> = {
  vertical: {
    card: {
      width: "100%",
      height: 500,
    },
  },
  horizontal: {
    card: {
      width: 300,
      height: 400,
    },
  },
};

type PostCardProps = {
  item: Post;
  isFetching: boolean;
  type?: CardType;
};

export const PostCard = ({ item, isFetching, type = "vertical" }: PostCardProps) => {
  const eventTimeStr = useMemo(() => formatIsoDate(item.eventTime), [item.eventTime]);
  const imageUrl = useMemo(() => item.imageUrls?.[0], [item.imageUrls]);
  const [imgLoading, setImgLoading] = useState(true);

  const skeletonOpacity = useRef(new Animated.Value(1)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (imgLoading || isFetching) return;

    Animated.timing(skeletonOpacity, {
      toValue: 0,
      duration: 500,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();

    Animated.timing(contentOpacity, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [isFetching, imgLoading, skeletonOpacity, contentOpacity]);

  const handleOpenDetail = useCallback(() => {
    router.push(POST_ROUTE.details(item.id) as ExternalPathString | RelativePathString);
  }, [item.id]);

  return (
    <View
      style={{
        position: "relative",
        width: CardConfigs[type].card.width,
        height: CardConfigs[type].card.height,
      }}
    >
      <Animated.View
        style={{
          opacity: contentOpacity,
          width: "100%",
          height: "100%",
        }}
      >
        <Pressable
          onPress={handleOpenDetail}
          className="bg-white rounded-[18px] overflow-hidden border border-slate-300"
          style={{
            width: "100%",
            height: "100%"
          }}
        >
          <Image
            source={{ uri: imageUrl }}
            style={{
              flex: 1,
              width: "100%",
            }}
            resizeMode="cover"
            onLoadStart={() => setImgLoading(true)}
            onLoadEnd={() => setImgLoading(false)}
            onError={() => setImgLoading(false)}
          />

          <View className="p-4 gap-2">
            <View className="flex-row items-center justify-between gap-2">
              <Text className="text-base font-extrabold text-slate-900 flex-1" numberOfLines={1}>
                {item.itemName}
              </Text>
              <PostStatusBadge status={item.postType} />
            </View>

            <View className="flex-row items-center gap-2">
              <ClockIcon size={16} color={colors.slate[500]} />
              <Text className="flex-1 text-sm text-slate-600" numberOfLines={1}>
                {eventTimeStr}
              </Text>
            </View>

            <View className="flex-row items-center gap-2">
              <MapPinIcon size={16} color={colors.slate[500]} />
              <Text className="flex-1 text-sm text-slate-600" numberOfLines={1}>
                {item.displayAddress ?? "Near here"}
              </Text>
            </View>
          </View>
        </Pressable>
      </Animated.View>

      <Animated.View
        pointerEvents="none"
        style={{
          position: "absolute",
          inset: 0,
          opacity: skeletonOpacity,
        }}
      >
        <PostCardSkeleton type={type} />
      </Animated.View>
    </View>
  );
};

type SkeletonProps = { type: CardType };

const PostCardSkeleton = ({ type }: SkeletonProps) => {
  const opacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.9,
          duration: 700,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.55,
          duration: 700,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      pointerEvents="none"
      className="bg-white rounded-[18px] overflow-hidden border border-slate-200"
      style={{
        opacity,
        width: CardConfigs[type].card.width,
        height: CardConfigs[type].card.height,
      }}
    >
      <View style={{ flex: 1, width: "100%" }} className="bg-slate-200" />

      <View className="p-4">
        <View className="flex-row items-center justify-between gap-2">
          <View className="h-8 bg-slate-200 rounded-md flex-1 mr-3" />
          <View className="h-8 w-16 bg-slate-200 rounded-full" />
        </View>

        <View className="flex-row items-center gap-2 mt-2">
          <View className="h-4 w-4 bg-slate-200 rounded" />
          <View className="h-4 bg-slate-200 rounded-md w-[55%]" />
        </View>

        <View className="flex-row items-center gap-2 mt-3">
          <View className="h-4 w-4 bg-slate-200 rounded" />
          <View className="h-4 bg-slate-200 rounded-md flex-1" />
        </View>
      </View>
    </Animated.View>
  );
};
