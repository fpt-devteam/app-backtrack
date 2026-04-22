import { useAppUser } from "@/src/features/auth/providers";
import { useCreateDirectConversation } from "@/src/features/chat/hooks";
import {
  PostCategoryBadge,
  PostTypeIconBadge,
  SimilarPostCard,
} from "@/src/features/post/components";
import { useMatchingPost } from "@/src/features/post/hooks";
import { AppUserAvatar, ImageCarousel } from "@/src/shared/components";
import { toast } from "@/src/shared/components/ui/toast";
import { CHAT_ROUTE, POST_ROUTE } from "@/src/shared/constants";
import { colors, metrics } from "@/src/shared/theme";
import { formatIsoDate, toTitleCase } from "@/src/shared/utils";
import { useHeaderHeight } from "@react-navigation/elements";
import { BlurView } from "expo-blur";
import { router, Stack } from "expo-router";
import { MotiView } from "moti";
import {
  ArrowLeftIcon,
  ChatCircleDotsIcon,
  ClockIcon,
  ExportIcon,
  IconProps,
  MapPinIcon,
  SealCheckIcon,
} from "phosphor-react-native";
import React, { ComponentType, useCallback, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { UserPost } from "../types";

const HeaderIcon = ({
  icon: Icon,
  onPress,
}: {
  icon: ComponentType<IconProps>;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Animated.View className="w-12 aspect-square rounded-full items-center justify-center overflow-hidden">
        <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
        <Icon size={20} color={colors.text.primary} weight="bold" />
      </Animated.View>
    </TouchableOpacity>
  );
};

type PostDetailScreenProps = {
  post: UserPost;
};

export const PostDetailScreen = ({ post }: PostDetailScreenProps) => {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { height, width } = useWindowDimensions();

  const CAROUSEL_HEIGHT = height * 0.5;
  const CAROUSEL_WIDTH = width;

  const scrollOffset = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollOffset.value = event.contentOffset.y;
  });

  const imgBgAnimationStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-CAROUSEL_HEIGHT, 0, CAROUSEL_HEIGHT],
            [-CAROUSEL_HEIGHT / 2, 0, CAROUSEL_HEIGHT * 0.75],
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-CAROUSEL_HEIGHT, 0, CAROUSEL_HEIGHT],
            [2, 1, 1],
          ),
        },
      ],

      opacity: interpolate(
        scrollOffset.value,
        [-CAROUSEL_HEIGHT, 0, CAROUSEL_HEIGHT],
        [0, 1, 0],
      ),
    };
  });

  const headerAnimationStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollOffset.value,
      [0, CAROUSEL_HEIGHT],
      [0, 1],
    );
    return { opacity };
  });

  const { user } = useAppUser();
  const { similarPosts } = useMatchingPost(post.id);

  const { create: createConversation, isCreating } =
    useCreateDirectConversation();

  const [isDismissing, setIsDismissing] = useState(false);

  const handleStartChat = useCallback(async () => {
    if (!post) return;
    const authorId = post.author.id;

    try {
      const response = await createConversation({ memberId: authorId });
      const conversationId = response.data?.conversation?.conversationId;

      if (conversationId) {
        setIsDismissing(true);

        if (router.canDismiss()) {
          router.dismissTo(POST_ROUTE.index);
        }

        const path = CHAT_ROUTE.message(conversationId);
        router.navigate(path);
      }
    } catch {
      toast.error("Failed to start chat. Please try again.");
    }
  }, [post]);

  const {
    postImageUrls,
    displayAddress,
    displayName,
    displayEventTime,
    isMyPost,
  } = useMemo(() => {
    if (!post) {
      return {
        postImageUrls: [] as string[],
        displayDescription: "",
        displayAddress: "Location not specified",
        displayName: "Anonymous",
        displayEventTime: "Event time not specified",
        itemDetailRows: [] as { label: string; value: string }[],
        isMyPost: true,
      };
    }

    const { author } = post;

    return {
      postImageUrls: post.imageUrls ?? [],
      displayAddress: toTitleCase(
        post.displayAddress || "Location not specified",
      ),
      displayName: author?.displayName || "Anonymous",
      displayEventTime:
        formatIsoDate(post.eventTime) || "Event time not specified",
      hasEmail: !!author?.showEmail && !!author?.email,
      hasPhone: !!author?.showPhone && !!author?.phone,
      isMyPost: author.id === user?.id,
    };
  }, [post, user]);

  const displayPostTitle = useMemo(() => {
    return post?.postTitle || "Untitled item";
  }, [post]);

  const formatEventDate = (dateStringOrObject: string | Date | undefined) => {
    if (!dateStringOrObject) {
      return { formattedDate: "Unknown Date", formattedTime: "Unknown Time" };
    }

    const date = new Date(dateStringOrObject);

    if (isNaN(date.getTime())) {
      return { formattedDate: "Invalid Date", formattedTime: "Invalid Time" };
    }

    const formattedDate = date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    return { formattedDate, formattedTime };
  };

  const { formattedDate, formattedTime } = formatEventDate(post.eventTime);

  const renderBody = () => {
    return (
      <>
        {/* Carousel */}
        <Animated.View
          style={[{ height: CAROUSEL_HEIGHT }, imgBgAnimationStyle]}
        >
          <ImageCarousel
            imageUrls={postImageUrls}
            height={CAROUSEL_HEIGHT}
            width={CAROUSEL_WIDTH}
          />
        </Animated.View>

        {/* Post Details */}
        <View
          className="flex-1 bg-surface rounded-t-4xl z-10 gap-xl"
          style={{ marginTop: -insets.top }}
        >
          {/* Post Title */}
          <MotiView
            from={{ opacity: 0, translateY: 8 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 280, delay: 80 }}
          >
            <View className="pt-xl gap-xs px-lg">
              <Text className="text-textPrimary font-normal text-2xl">
                {displayPostTitle}
              </Text>

              {/* Badges */}
              <View className="flex-row gap-xs items-center justify-start">
                <PostTypeIconBadge status={post.postType} size="xs" />
                <PostCategoryBadge category={post.category} />
              </View>
            </View>
          </MotiView>

          <View className="border-t border-muted mx-lg" />

          {/* When it's happening */}
          <MotiView
            from={{ opacity: 0, translateY: 8 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 240, delay: 260 }}
          >
            <View className="gap-sm px-lg">
              <Text className="text-lg font-normal text-textPrimary">
                When it&apos;s happening
              </Text>

              <View className="gap-xs mb-sm">
                <View className="flex-row gap-xs">
                  <ClockIcon
                    size={14}
                    color={colors.mutedForeground}
                    weight="regular"
                  />

                  <Text
                    className="flex-1 text-sm text-textSecondary"
                    numberOfLines={2}
                  >
                    {formattedTime}, {formattedDate}
                  </Text>
                </View>
              </View>
            </View>
          </MotiView>

          {/* Divider */}
          <View className="border-t border-muted mx-lg" />

          {/* Where it's happening */}
          <MotiView
            from={{ opacity: 0, translateY: 8 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 240, delay: 260 }}
          >
            <View className="gap-sm px-lg">
              <Text className="text-lg font-normal text-textPrimary">
                Where it&apos;s happening
              </Text>

              <View className="gap-xs mb-sm">
                <View className="flex-row gap-xs">
                  <MapPinIcon
                    size={14}
                    color={colors.mutedForeground}
                    weight="regular"
                  />

                  <Text
                    className="flex-1 text-sm text-textSecondary"
                    numberOfLines={2}
                  >
                    {displayAddress}
                  </Text>
                </View>
              </View>

              <View
                className="overflow-hidden rounded-xl"
                style={{ height: 280 }}
              >
                <MapView
                  style={{ flex: 1 }}
                  initialRegion={{
                    latitude: post.location?.latitude,
                    longitude: post.location?.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                  scrollEnabled={false}
                  zoomEnabled={false}
                  pitchEnabled={false}
                  rotateEnabled={false}
                >
                  <Marker coordinate={post.location} />
                </MapView>
              </View>
            </View>
          </MotiView>

          {/* Divider */}
          <View className="border-t border-muted mx-lg" />

          {/* Post Owner Information */}
          <MotiView
            from={{ opacity: 0, translateY: 8 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 240, delay: 320 }}
          >
            <View className="gap-md px-lg">
              <Text className="text-lg font-normal text-textPrimary">
                Your host
              </Text>

              {/* Avatar + name + message icon */}
              <View className="flex-row items-center gap-md">
                <AppUserAvatar
                  avatarUrl={post.author?.avatarUrl}
                  size={metrics.spacing["2xl"]}
                />

                {/* Host info */}
                <View className="flex-1 flex-col gap-xs justify-between">
                  <Text
                    className="text-base text-textPrimary"
                    numberOfLines={1}
                  >
                    {displayName}
                  </Text>

                  {/* Verified rows*/}
                  <View
                    className="flex-row items-center self-start gap-xs rounded-full px-sm py-xs"
                    style={{
                      backgroundColor: colors.babu[100],
                    }}
                  >
                    <SealCheckIcon
                      size={12}
                      color={colors.babu[500]}
                      weight="fill"
                    />
                    <Text
                      className="text-xs font-normal"
                      style={{ color: colors.babu[600] }}
                    >
                      Verified
                    </Text>
                  </View>
                </View>

                {/* Chat icon button */}
                {isMyPost ? null : (
                  <TouchableOpacity
                    onPress={handleStartChat}
                    disabled={isCreating}
                    className="p-2 rounded-full border"
                  >
                    <ChatCircleDotsIcon size={24} weight="regular" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </MotiView>

          {/* Divider */}
          <View className="border-t border-muted mx-lg" />

          {/* Potential matches*/}
          <MotiView
            from={{ opacity: 0, translateY: 8 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 240, delay: 380 }}
          >
            {!!similarPosts?.length && (
              <View className="gap-sm">
                <View className="flex-row items-center justify-between px-lg">
                  <Text className="text-lg font-normal text-textPrimary">
                    Potential matches
                  </Text>
                  {similarPosts.length > 3 && (
                    <TouchableOpacity
                      onPress={() => console.log("See all similar posts")}
                      hitSlop={8}
                    >
                      <Text className="text-sm text-primary">See all →</Text>
                    </TouchableOpacity>
                  )}
                </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    gap: metrics.spacing.md,
                    paddingHorizontal: metrics.spacing.lg,
                  }}
                >
                  {similarPosts.map((p) => (
                    <View
                      key={p.id}
                      style={{
                        width: Math.round(
                          (width - metrics.spacing.lg - 12) / 1.5,
                        ),
                      }}
                    >
                      <SimilarPostCard matchPost={p} onPress={() => {}} />
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}
          </MotiView>
        </View>
      </>
    );
  };

  const handleHandover = () => {
    router.push(POST_ROUTE.handoverRequest(post.id));
  };

  return (
    <>
      <Stack.Screen
        options={{
          animation: isDismissing ? "none" : "default",
          headerTitle: "",
          headerTransparent: true,
          presentation: "card",
          headerBackground: () => (
            <Animated.View
              style={[
                {
                  height: headerHeight,
                  backgroundColor: colors.surface,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border.muted,
                },
                headerAnimationStyle,
              ]}
            />
          ),

          headerLeft: () => (
            <HeaderIcon icon={ArrowLeftIcon} onPress={() => router.back()} />
          ),

          headerRight: () => (
            <View>
              <HeaderIcon
                icon={ExportIcon}
                onPress={() => console.log("Export")}
              />
            </View>
          ),
        }}
      />

      <Animated.ScrollView
        className="flex-1 bg-surface"
        contentContainerStyle={{ paddingBottom: insets.bottom }}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {renderBody()}
      </Animated.ScrollView>

      {/* Footer */}
      <View
        className="flex-row items-center justify-between bg-surface p-md border-t border-muted"
        style={{ paddingBottom: insets.bottom }}
      >
        {/* Summary Info */}
        <View className="flex-col items-center flex-1 pr-md">
          <View className="flex-row items-center gap-xs">
            <ClockIcon size={16} color={colors.secondary} weight="regular" />
            <Text
              className="flex-1 text-sm font-normal text-textPrimary"
              numberOfLines={1}
            >
              {displayEventTime}
            </Text>
          </View>

          <View className="mt-xs flex-row items-center gap-xs">
            <MapPinIcon size={16} color={colors.secondary} weight="regular" />
            <Text
              className="flex-1 text-sm font-normal text-textPrimary"
              numberOfLines={1}
            >
              {displayAddress}
            </Text>
          </View>
        </View>

        {/* Handover Button */}
        <TouchableOpacity
          onPress={handleHandover}
          className="px-xl py-3 rounded-full bg-primary"
        >
          <Text className="text-base font-normal text-white">
            Start handover
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};
