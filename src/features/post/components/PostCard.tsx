import type { Post } from "@/src/features/post/types";
import { POST_ROUTE } from "@/src/shared/constants";
import { getRandomAvatarUrl } from "@/src/shared/mocks/avatar.mock";
import { timeSincePast } from "@/src/shared/utils";
import type { ExternalPathString, RelativePathString } from "expo-router";
import { router } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import type { DimensionValue } from "react-native";
import { Animated, Easing, Image, Pressable, Text, View } from "react-native";
import { PostStatusBadge } from "./PostStatusBadge";

type CardType = "vertical" | "horizontal";

const CARD: Record<
  CardType,
  { width: DimensionValue; height: DimensionValue }
> = {
  vertical: { width: "100%", height: 520 },
  horizontal: { width: 320, height: 440 },
};

type PostCardProps = {
  item: Post;
  isFetching: boolean;
  type?: CardType;
};

export const PostCard = ({
  item,
  isFetching,
  type = "vertical",
}: PostCardProps) => {
  const imageUrl = item.images?.[0];
  const authorName = item.author?.displayName?.trim() || "Anonymous";
  const avatarUrl = item.author?.avatarUrl || getRandomAvatarUrl();

  const [imgLoaded, setImgLoaded] = useState(false);
  const contentOpacity = useRef(new Animated.Value(0)).current;

  const ready = imgLoaded && !isFetching;

  useEffect(() => {
    if (!ready) return;
    Animated.timing(contentOpacity, {
      toValue: 1,
      duration: 280,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [ready, contentOpacity]);

  const handleOpenDetail = useCallback(() => {
    router.push(
      POST_ROUTE.details(item.id) as ExternalPathString | RelativePathString,
    );
  }, [item.id]);

  return (
    <View style={{ width: CARD[type].width, height: CARD[type].height }}>
      <Animated.View
        style={{ opacity: contentOpacity, width: "100%", height: "100%" }}
      >
        <Pressable
          onPress={handleOpenDetail}
          className="bg-white rounded-2xl overflow-hidden border border-slate-200"
          style={{ width: "100%", height: "100%" }}
        >
          {/* Header */}
          <View className="px-4 pt-4 pb-2 flex-row items-center">
            {/* Avatar */}
            <View className="w-10 h-10 rounded-full overflow-hidden bg-slate-200">
              <Image
                source={{ uri: avatarUrl }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            </View>

            <View className="flex-1 min-w-0 ml-3">
              <Text
                className="text-base font-extrabold text-slate-900"
                numberOfLines={1}
              >
                {authorName}
              </Text>
              <Text className="text-xs text-slate-500" numberOfLines={1}>
                {timeSincePast(item.createdAt)}
              </Text>
            </View>

            {/* Badge like "Lost/Found" */}
            <View className="absolute top-4 right-4">
              <PostStatusBadge status={item.postType} size="lg" />
            </View>
          </View>

          {/* Body text */}
          <View className="px-4 pb-3">
            <Text
              className="mb-3 text-md leading-5 text-slate-700"
              numberOfLines={2}
            >
              {item.itemName}
            </Text>
          </View>

          {/* Image area */}
          <View className="px-4 pb-4 flex-1">
            <View className="relative flex-1 rounded-2xl overflow-hidden bg-slate-100">
              <Image
                source={imageUrl ? { uri: imageUrl } : undefined}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
                onLoadEnd={() => setImgLoaded(true)}
                onError={() => setImgLoaded(true)}
              />
            </View>
          </View>
        </Pressable>
      </Animated.View>

      {!ready && (
        <View pointerEvents="none" style={{ position: "absolute", inset: 0 }}>
          <PostCardSkeleton type={type} />
        </View>
      )}
    </View>
  );
};

type SkeletonProps = { type: CardType };

const PostCardSkeleton = ({ type }: SkeletonProps) => {
  const pulse = useRef(new Animated.Value(0.55)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 0.9,
          duration: 650,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.55,
          duration: 650,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <Animated.View
      className="bg-white rounded-2xl overflow-hidden border border-slate-200"
      style={{
        opacity: pulse,
        width: CARD[type].width,
        height: CARD[type].height,
      }}
    >
      {/* Header skeleton */}
      <View className="px-4 pt-4 pb-2 flex-row items-center">
        <View className="w-10 h-10 rounded-full bg-slate-200" />
        <View className="flex-1 ml-3">
          <View className="h-4 w-[45%] bg-slate-200 rounded-md" />
          <View className="h-3 w-[25%] bg-slate-200 rounded-md mt-2" />
        </View>
        <View className="h-5 w-5 bg-slate-200 rounded-md" />
      </View>

      {/* Text skeleton */}
      <View className="px-4 pb-3">
        <View className="h-3 w-[90%] bg-slate-200 rounded-md" />
        <View className="h-3 w-[75%] bg-slate-200 rounded-md mt-2" />
      </View>

      {/* Image skeleton */}
      <View className="px-4 pb-4 flex-1">
        <View className="flex-1 rounded-2xl bg-slate-200 overflow-hidden">
          {/* badge placeholder */}
          <View className="absolute top-3 right-3 h-7 w-16 rounded-full bg-white/80 border border-slate-200" />
        </View>
      </View>
    </Animated.View>
  );
};
