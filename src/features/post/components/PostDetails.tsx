import { useAppUser } from "@/src/features/auth/providers";
import { useCreateDirectConversation } from "@/src/features/chat/hooks";
import { InfoRow } from "@/src/features/post/components/PostInfoRow";
import { useGetPostById, useMatchingPost } from "@/src/features/post/hooks";
import { PostType } from "@/src/features/post/types";
import { AppDivider } from "@/src/shared/components";
import { CHAT_ROUTE } from "@/src/shared/constants";
import { colors, metrics, typography } from "@/src/shared/theme";
import { formatIsoDate } from "@/src/shared/utils";
import { router } from "expo-router";
import { CalendarIcon, MapPinIcon } from "phosphor-react-native";
import React, { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Pressable,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SimilarPostCard } from "./SimilarPostCard";

type PostDetailsProps = {
  postId: string;
  context?: "screen" | "sheet";
};

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
    className="rounded-full bg-primary px-xl h-control-lg items-center justify-center active:opacity-90"
    disabled={disabled}
    onPress={onPress}
  >
    <Text className="text-white font-bold text-base tracking-label">
      {title}
    </Text>
  </TouchableOpacity>
);

const HeaderActionButton = ({
  icon,
  onPress,
}: {
  icon: React.ReactNode;
  onPress: () => void;
}) => {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={metrics.touchTarget.defaultHitSlop}
      className="w-9 h-9 rounded-full items-center justify-center bg-surface"
      style={({ pressed }) => ({
        opacity: pressed ? 0.82 : 1,
      })}
    >
      {icon}
    </Pressable>
  );
};

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
    <View className="flex-1 bg-surface">
      <S className="h-[420px] w-full" />

      <View className="px-md pt-md gap-md">
        <View className="gap-sm">
          <S className="h-8 rounded-xl w-[82%]" />
          <S className="h-4 rounded-lg w-[64%]" />
          <S className="h-4 rounded-lg w-[72%]" />
        </View>

        <S className="h-[1px] w-full" />

        {[0, 1].map((i) => (
          <View key={i} className="flex-row gap-3 items-center">
            <S className="h-10 w-10 rounded-2xl" />
            <View className="flex-1 gap-2">
              <S className="h-3 w-32 rounded-lg" />
              <S className="h-4 w-[78%] rounded-lg" />
            </View>
          </View>
        ))}

        <View className="gap-2">
          <S className="h-3 rounded-lg w-full" />
          <S className="h-3 rounded-lg w-[92%]" />
          <S className="h-3 rounded-lg w-[74%]" />
        </View>
      </View>
    </View>
  );
};

export const PostDetails = ({
  postId,
  context = "sheet",
}: PostDetailsProps) => {
  const { top, bottom } = useSafeAreaInsets();
  const { user } = useAppUser();
  const { isLoading, data: post } = useGetPostById({ postId });
  const { similarPosts } = useMatchingPost(postId);
  const { create } = useCreateDirectConversation();

  const authorDisplayName = post?.author?.displayName?.trim() || "Anonymous";
  const isOwner = !!post && post.author?.id === user?.id;
  const isScreen = context === "screen";
  const postImageUrls = post?.imageUrls ?? [];

  const chatLabel = useMemo(() => {
    if (!post) return "Contact";

    return post.postType === PostType.Lost
      ? "Start chat with Finder"
      : "Start chat with Seeker";
  }, [post]);

  if (isLoading || !post) return <PostDetailsSkeleton />;

  const handleCreateChat = async () => {
    try {
      if (!post.author?.id) return;

      const req = { memberId: post.author.id };
      const res = await create(req);
      const conversationId = res.data?.conversation?.conversationId;

      if (!conversationId) return;
      router.push(CHAT_ROUTE.message(conversationId));
    } catch {
      return;
    }
  };

  const handleSharePost = async () => {
    try {
      await Share.share({
        message: `${post.item.itemName} • ${post.postType} • ${post.displayAddress || "Unknown area"}`,
      });
    } catch {
      return;
    }
  };

  return (
    <View className="flex-1 bg-surface">
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: isScreen
            ? isOwner
              ? bottom + metrics.spacing.xl
              : bottom + metrics.layout.controlHeight.lg + metrics.spacing.xl
            : metrics.spacing.xl,
        }}
      >
        <View className="px-md pt-md gap-md2">
          <View className="gap-xs">
            <Text
              className="text-textPrimary"
              style={{
                fontSize: typography.fontSize["2xl"],
                fontWeight: "700",
                lineHeight: typography.lineHeight["2xl"],
                letterSpacing: typography.letterSpacing.heading,
              }}
            >
              {post.item.itemName}
            </Text>

            <Text
              className="text-textSecondary"
              style={{
                fontSize: typography.fontSize.sm,
                fontWeight: "500",
              }}
            >
              {post.postType === PostType.Lost ? "Lost item" : "Found item"} in{" "}
              {post.displayAddress || "Unknown area"}
            </Text>
          </View>

          <View className="flex-row items-center gap-sm">
            <View className="w-11 h-11 rounded-full overflow-hidden bg-muted items-center justify-center">
              <Text className="text-sm font-bold text-textPrimary">
                {authorDisplayName.slice(0, 1).toUpperCase()}
              </Text>
            </View>

            <View className="flex-1">
              <Text
                className="text-sm font-semibold text-textPrimary"
                numberOfLines={1}
              >
                Posted by {authorDisplayName}
              </Text>
              <Text className="text-xs text-textSecondary">
                {formatIsoDate(post.createdAt)}
              </Text>
            </View>
          </View>

          <AppDivider />

          <View className="gap-sm">
            <InfoRow
              icon={
                <MapPinIcon size={20} color={colors.primary} weight="fill" />
              }
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

          {!!post.description && (
            <View className="gap-xs">
              <Text className="text-sm font-semibold text-textPrimary">
                Description
              </Text>
              <Text className="text-sm text-textSecondary leading-sm">
                {post.description}
              </Text>
            </View>
          )}

          {!!similarPosts?.length && (
            <View className="pt-sm gap-sm">
              <Text className="text-base font-extrabold text-textPrimary">
                Similar posts
              </Text>
              <View className="gap-3">
                {similarPosts.map((p) => (
                  <SimilarPostCard key={p.id} postId={post.id} matchPost={p} />
                ))}
              </View>
            </View>
          )}
        </View>
      </Animated.ScrollView>

      {!isOwner && isScreen && (
        <View
          pointerEvents="box-none"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            paddingBottom: bottom + metrics.spacing.sm,
            paddingHorizontal: metrics.spacing.md,
            paddingTop: metrics.spacing.sm,
            backgroundColor: colors.surface,
            borderTopWidth: 1,
            borderTopColor: colors.divider,
          }}
        >
          <PrimaryButton title={chatLabel} onPress={handleCreateChat} />
        </View>
      )}

      {!isOwner && !isScreen && (
        <View className="px-md pb-xl pt-sm">
          <PrimaryButton title={chatLabel} onPress={handleCreateChat} />
        </View>
      )}
    </View>
  );
};
