import { useAppUser } from "@/src/features/auth/providers";
import { useCreateDirectConversation } from "@/src/features/chat/hooks";
import { InfoRow } from "@/src/features/post/components/PostInfoRow";
import { useGetPostById, useMatchingPost } from "@/src/features/post/hooks";
import { PostType } from "@/src/features/post/types";
import { AppDivider, ImageCarousel } from "@/src/shared/components";
import { CHAT_ROUTE } from "@/src/shared/constants";
import { colors } from "@/src/shared/theme/colors";
import { formatIsoDate } from "@/src/shared/utils";
import { router } from "expo-router";
import { CalendarIcon, MapPinIcon } from "phosphor-react-native";
import React, { useEffect, useRef } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PostStatusBadge } from "./PostStatusBadge";
import { SimilarPostCard } from "./SimilarPostCard";

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
    <View className="mx-4 mt-4 bg-surface rounded-3xl border border-divider overflow-hidden">
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

      <AppDivider />

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
        <View className="rounded-2xl overflow-hidden border border-divider">
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
  const { create } = useCreateDirectConversation();

  const isOwner = !!post && post.author.id === user?.id;

  const scrollY = useRef(new Animated.Value(0)).current;

  if (isLoading || !post) return <PostDetailsSkeleton />;

  const handleCreateChat = async () => {
    try {
      const req = { memberId: post.author.id };
      const res = await create(req);
      if (!res.data?.conversation?.conversationId) {
        console.log("Missing conversation ID in response:", res.data);
        return;
      }
      router.push(CHAT_ROUTE.message(res.data?.conversation?.conversationId));
    } catch (error) {
      console.error("Failed to create conversation:", error);
    }
  };

  const chatLabel =
    post.postType === PostType.Lost
      ? "Start chat with Finder"
      : "Start chat with Seeker";

  const postImageUrls = post.images.map((img) => img.url);

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
      <ImageCarousel data={postImageUrls} />
      <View className="mx-4 mt-4 bg-surface rounded-3xl border border-divider overflow-hidden">
        <View className="px-5 pt-5 pb-4">
          <View className="flex-row items-start justify-between gap-3">
            <Text
              className="flex-1 text-[22px] font-extrabold text-textPrimary leading-7"
              numberOfLines={2}
            >
              {post.itemName}
            </Text>
            <PostStatusBadge status={post.postType} size="md" />
          </View>

          {!!post.description && (
            <Text className="mt-3 text-[13px] leading-[19px] text-textSecondary">
              {post.description}
            </Text>
          )}
        </View>

        <AppDivider />

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
          <PrimaryButton title={chatLabel} onPress={handleCreateChat} />
        </View>
      )}

      {!!similarPosts?.length && (
        <View className="mx-4 mt-6">
          <Text className="text-[16px] font-extrabold text-textPrimary">
            Similar Posts
          </Text>

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
