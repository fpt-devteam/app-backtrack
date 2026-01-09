import { PostStatusBadge } from "@/src/features/post/components";
import { Post } from "@/src/features/post/types";
import { POST_ROUTE } from "@/src/shared/constants";
import { colors } from "@/src/shared/theme";
import { formatIsoDate } from "@/src/shared/utils";
import { ExternalPathString, RelativePathString, router } from "expo-router";
import { Clock, MapPin } from "phosphor-react-native";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, Image, Pressable, Text, View } from "react-native";

interface PostCardProps {
  item: Post;
  isFetching: boolean;
}

const IMAGE_HEIGHT = 400;

const PostCard = ({ item, isFetching }: PostCardProps) => {
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
  }, [isFetching, imgLoading, skeletonOpacity, contentOpacity,]);

  const handleOpenDetail = useCallback(() => {
    router.push(POST_ROUTE.details(item.id) as ExternalPathString | RelativePathString);
  }, [item.id]);

  return (

    <View className="m-4" style={{ position: "relative" }}>
      <Animated.View style={{ opacity: contentOpacity }}>
        <Pressable
          onPress={handleOpenDetail}
          className="bg-white rounded-[18px] overflow-hidden border border-slate-300"
          style={{
            shadowColor: "#000",
            shadowOpacity: 0.08,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 6 },
            elevation: 3,
          }}
        >
          {/* Image header */}
          <View className="relative" style={{ height: IMAGE_HEIGHT }}>
            <Image
              source={{ uri: imageUrl }}
              className="w-full"
              style={{ height: IMAGE_HEIGHT }}
              resizeMode="cover"
              onLoadStart={() => setImgLoading(true)}
              onLoadEnd={() => setImgLoading(false)}
              onError={() => setImgLoading(false)}
            />
          </View>

          {/* Content */}
          <View className="p-4 gap-2">
            <View className="flex-row items-center justify-between gap-2.5">
              <Text className="text-base font-extrabold text-slate-900 flex-1" numberOfLines={1}>
                {item.itemName}
              </Text>
              <PostStatusBadge status={item.postType} />
            </View>

            {/* Event Time */}
            <View className="flex-row items-center gap-2">
              <Clock size={16} color={colors.slate[500]} />
              <Text className="flex-1 text-sm text-slate-600">{eventTimeStr}</Text>
            </View>

            {/* Location */}
            <View className="flex-row items-center gap-2">
              <MapPin size={16} color={colors.slate[500]} />
              <Text className="flex-1 text-sm text-slate-600" numberOfLines={1}>{item.displayAddress ?? "Near here"}</Text>
            </View>
          </View>
        </Pressable>
      </Animated.View>

      {/* Skeleton overlay */}
      <Animated.View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          opacity: skeletonOpacity,
        }}
      >
        <PostCardSkeleton />
      </Animated.View>
    </View >
  );
};

const PostCardSkeleton = () => {
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
      style={{ opacity }}
    >
      {/* Image skeleton  */}
      <View className="w-full bg-slate-200" style={{ height: IMAGE_HEIGHT }} />

      {/* Content skeleton  */}
      <View className="p-4">
        {/* Title + badge */}
        <View className="flex-row items-center justify-between gap-2">
          <View className="h-8 bg-slate-200 rounded-md flex-1 mr-3" />
          <View className="h-8 w-16 bg-slate-200 rounded-full" />
        </View>

        {/* Event time skeleton */}
        <View className="flex-row items-center gap-2 mt-2">
          <View className="h-4 w-4 bg-slate-200 rounded" />
          <View className="h-4 bg-slate-200 rounded-md w-[55%]" />
        </View>

        {/* Location  */}
        <View className="flex-row items-center gap-2 mt-3">
          <View className="h-4 w-4 bg-slate-200 rounded" />
          <View className="h-4 bg-slate-200 rounded-md flex-1" />
        </View>
      </View>
    </Animated.View>
  );
};

export default PostCard;
