import { useAppUser } from "@/src/features/auth/providers";
import { useCreateConversation } from "@/src/features/chat/hooks";
import {
  CONVERSATION_TYPE,
  type ConversationCreateRequest,
} from "@/src/features/chat/types";
import { PostStatusBadge } from "@/src/features/post/components/badges/PostStatusBadge";
import { SimilarPostCard } from "@/src/features/post/components/cards/SimilarPostCard";
import { InfoRow } from "@/src/features/post/components/ui/PostInfoRow";
import { useGetPostById, useMatchingPost } from "@/src/features/post/hooks";
import { PostType } from "@/src/features/post/types";
import { ImageCarousel } from "@/src/shared/components";
import { Divider } from "@/src/shared/components/ui/Divider";
import { toast } from "@/src/shared/components/ui/toast";
import { CHAT_ROUTE } from "@/src/shared/constants";
import { colors } from "@/src/shared/theme/colors";
import { formatIsoDate } from "@/src/shared/utils";
import { router } from "expo-router";
import { CalendarIcon, MapPinIcon } from "phosphor-react-native";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import type MapView from "react-native-maps";
import type { Region } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type PostDetailsProps = { postId: string };

const PrimaryButton = ({
  title,
  disabled,
  onPress,
}: {
  title: string;
  disabled?: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    className="w-full bg-primary rounded-2xl py-4 items-center justify-center active:opacity-90"
    disabled={disabled}
    onPress={onPress}
  >
    <Text className="text-white font-bold text-[15px]">{title}</Text>
  </TouchableOpacity>
);

export const PostDetailsSkeleton = () => {
  const opacity = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.9,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.45,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [opacity]);

  const S = ({ className }: { className: string }) => (
    <Animated.View
      style={{ opacity }}
      className={`bg-slate-200 ${className}`}
    />
  );

  return (
    <View className="mx-4 mt-4 bg-white rounded-3xl border border-slate-200 overflow-hidden">
      <View className="px-5 pt-5 pb-4">
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1 gap-2">
            <S className="h-7 rounded-xl w-[82%]" />
            <S className="h-7 rounded-xl w-[52%]" />
          </View>
          <S className="h-7 w-20 rounded-full" />
        </View>

        <View className="mt-4 gap-2">
          <S className="h-3 rounded-lg w-[95%]" />
          <S className="h-3 rounded-lg w-[88%]" />
          <S className="h-3 rounded-lg w-[70%]" />
        </View>
      </View>

      <Divider />

      <View className="p-5 gap-4">
        {[0, 1, 2].map((i) => (
          <View key={i} className="flex-row gap-3 items-center">
            <S className="h-10 w-10 rounded-2xl" />
            <View className="flex-1 gap-2">
              <S className="h-3 w-36 rounded-lg" />
              <S className="h-4 w-[80%] rounded-lg" />
            </View>
          </View>
        ))}
      </View>

      <View className="px-5 pb-5">
        <View className="rounded-2xl overflow-hidden border border-slate-200">
          <S className="h-44 w-full rounded-none" />
          <View className="absolute right-3 bottom-3">
            <S className="h-11 w-11 rounded-2xl" />
          </View>
        </View>
      </View>
    </View>
  );
};

export const PostDetails = ({ postId }: PostDetailsProps) => {
  const { bottom } = useSafeAreaInsets();
  const { user } = useAppUser();
  const { isLoading, data: post } = useGetPostById({ postId });
  const { similarPosts } = useMatchingPost(postId);
  const { createConversation, isCreatingConversation } =
    useCreateConversation();

  const isOwner = !!post && post.author.id === user?.id;

  const handleCreateConversation = useCallback(async () => {
    if (!post) return;

    const req: ConversationCreateRequest = {
      memberId: post.author.id,
      type: CONVERSATION_TYPE.PERSONAL,
    };

    try {
      const response = await createConversation(req);
      const id = response?.data?.conversationId;
      if (!id) return;
      router.push(CHAT_ROUTE.message(id));
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  }, [post, createConversation]);

  const mapRef = useRef<MapView>(null);
  const region: Region | undefined = useMemo(() => {
    if (!post?.location) return undefined;
    return {
      latitude: post.location.latitude,
      longitude: post.location.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  }, [post?.location]);

  useEffect(() => {
    if (!region) return;
    mapRef.current?.animateToRegion(region, 650);
  }, [region]);

  const scrollY = useRef(new Animated.Value(0)).current;

  if (isLoading || !post) {
    console.log("isLoading", isLoading);
    console.log("post", post);
    return <PostDetailsSkeleton />;
  }

  const chatLabel =
    post.postType === PostType.Lost
      ? "Start chat with Finder"
      : "Start chat with Seeker";

  return (
    <Animated.ScrollView
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: false },
      )}
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
      contentContainerStyle={{ paddingBottom: bottom + 20 }}
    >
      <ImageCarousel data={post.imageUrls} />
      <View className="mx-4 mt-4 bg-white rounded-3xl border border-slate-200 overflow-hidden">
        <View className="px-5 pt-5 pb-4">
          <View className="flex-row items-start justify-between gap-3">
            <Text
              className="flex-1 text-[22px] font-extrabold text-slate-900 leading-7"
              numberOfLines={2}
            >
              {post.itemName}
            </Text>
            <PostStatusBadge status={post.postType} size="md" />
          </View>

          {!!post.description && (
            <Text className="mt-3 text-[13px] leading-[19px] text-slate-600">
              {post.description}
            </Text>
          )}
        </View>

        <Divider />

        <View className="p-5 gap-4">
          <InfoRow
            icon={<MapPinIcon size={20} color={colors.primary} weight="fill" />}
            label="Last seen location"
            value={post.displayAddress || "N/A"}
          />
          <InfoRow
            icon={
              <CalendarIcon size={20} color={colors.primary} weight="fill" />
            }
            label="Event time"
            value={formatIsoDate(post.eventTime)}
          />
        </View>
      </View>

      {!isOwner && (
        <View className="mx-4 mt-4">
          <PrimaryButton
            title={chatLabel}
            disabled={isCreatingConversation}
            onPress={handleCreateConversation}
          />
        </View>
      )}

      {!!similarPosts?.length && (
        <View className="mx-4 mt-6">
          <View className="flex-row items-center justify-between">
            <Text className="text-[16px] font-extrabold text-slate-900">
              Similar Posts
            </Text>
            <Text className="text-[12px] text-slate-500">
              {similarPosts.length}
            </Text>
          </View>

          <View className="mt-3 gap-3">
            {similarPosts.map((p) => (
              <SimilarPostCard key={p.id} postId={post.id} matchPost={p} />
            ))}
          </View>
        </View>
      )}
    </Animated.ScrollView>
  );
};
