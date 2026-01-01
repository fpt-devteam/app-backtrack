import { timeSincePast } from "@/src/shared/utils";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Animated, Image, Pressable, Text, View } from "react-native";
import { PREFIX_PATH_POST } from "../constants/post.constant";
import { Post } from "../types";
import PostStatusBadge from "./PostStatusBadge";

interface PostCardProps {
  item: Post;
  isLoading?: boolean;
}

const IMAGE_HEIGHT = 170;

function PostCardSkeleton({ opacity }: { opacity: Animated.Value }) {
  return (
    <Animated.View
      pointerEvents="none"
      className="bg-white rounded-[18px] overflow-hidden border border-slate-200"
      style={{ opacity }}
    >
      <View className="w-full bg-slate-200" style={{ height: IMAGE_HEIGHT }} />

      <View className="p-4 gap-3">
        <View className="flex-row items-center justify-between gap-2.5">
          <View className="h-5 bg-slate-200 rounded-md flex-1 mr-3" />
          <View className="h-6 w-16 bg-slate-200 rounded-full" />
        </View>

        <View className="gap-2">
          <View className="h-4 bg-slate-200 rounded-md w-full" />
          <View className="h-4 bg-slate-200 rounded-md w-[85%]" />
        </View>

        <View className="flex-row items-center gap-2">
          <View className="h-4 w-4 bg-slate-200 rounded" />
          <View className="h-4 bg-slate-200 rounded-md flex-1" />
        </View>

        <View className="flex-row items-center gap-2">
          <View className="h-4 w-4 bg-slate-200 rounded" />
          <View className="h-4 bg-slate-200 rounded-md w-[45%]" />
        </View>
      </View>
    </Animated.View>
  );
}

const PostCard = React.memo(({ item }: PostCardProps) => {
  const postedAgo = useMemo(() => timeSincePast(item.createdAt), [item.createdAt]);
  const imageUrl = item.imageUrls?.[0];


  const [imgReady, setImgReady] = useState(false);


  const skeletonOpacity = useRef(new Animated.Value(1)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;


  const shimmer = useRef(new Animated.Value(0.55)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 0.9, duration: 700, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0.55, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [shimmer]);


  useEffect(() => {
    const shouldWaitImage = !!imageUrl;
    setImgReady(!shouldWaitImage);

    skeletonOpacity.setValue(1);
    contentOpacity.setValue(shouldWaitImage ? 0 : 1);
  }, [item.id, imageUrl, skeletonOpacity, contentOpacity]);

  const handleOpenDetail = useCallback(() => {
    router.push(`${PREFIX_PATH_POST}/${item.id}`);
  }, [item.id]);

  const reveal = useCallback(() => {
    if (imgReady) return;
    setImgReady(true);

    Animated.parallel([
      Animated.timing(skeletonOpacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
  }, [imgReady, skeletonOpacity, contentOpacity]);

  return (
    <View className="m-4" style={{ position: "relative" }}>
      {/* Content (real card) */}
      <Animated.View style={{ opacity: contentOpacity }}>
        <Pressable
          onPress={handleOpenDetail}
          className="bg-white rounded-[18px] overflow-hidden border border-slate-300 shadow-lg"
          style={{
            shadowColor: "#000",
            shadowOpacity: 0.08,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 6 },
            elevation: 3,
          }}
        >
          {/* Image header with fixed height to prevent layout shift */}
          <View className="relative" style={{ height: IMAGE_HEIGHT }}>
            {imageUrl ? (
              <Image
                source={{ uri: imageUrl }}
                className="w-full"
                style={{ height: IMAGE_HEIGHT }}
                resizeMode="cover"
                onLoadEnd={reveal}
                onError={reveal}
              />
            ) : (
              <View className="w-full bg-slate-200" style={{ height: IMAGE_HEIGHT }} />
            )}
          </View>

          {/* Content */}
          <View className="p-4 gap-2">
            <View className="flex-row items-center justify-between gap-2.5">
              <Text className="text-base font-extrabold text-slate-900 flex-1" numberOfLines={1}>
                {item.itemName}
              </Text>
              <PostStatusBadge status={item.postType} />
            </View>

            <Text className="text-[13px] leading-[18px] text-slate-500" numberOfLines={2}>
              {item.description}
            </Text>

            <View className="flex-row items-center gap-2">
              <Ionicons name="location-outline" size={16} color="#64748B" />
              <Text className="flex-1 text-[13px] text-slate-600" numberOfLines={1}>
                {item.displayAddress ?? "Near here"}
              </Text>
            </View>

            <View className="flex-row items-center gap-2">
              <Ionicons name="time-outline" size={16} color="#64748B" />
              <Text className="flex-1 text-[13px] text-slate-600">Posted {postedAgo}</Text>
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
        <PostCardSkeleton opacity={shimmer} />
      </Animated.View>
    </View>
  );
});

PostCard.displayName = "PostCard";

export default PostCard;
