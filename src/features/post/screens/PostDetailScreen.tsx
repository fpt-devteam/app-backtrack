import { useCreateDirectConversation } from "@/src/features/chat/hooks";
import { UserPlaceMarker } from "@/src/features/map/components";
import {
  PostStatusBadge,
  SimilarPostCard,
} from "@/src/features/post/components";
import { CATEGORY_REGISTRY } from "@/src/features/post/constants";
import { useGetPostById, useMatchingPost } from "@/src/features/post/hooks";
import { PostItem, PostType } from "@/src/features/post/types";
import {
  AppInlineError,
  AppLoader,
  AppUserAvatar,
  ImageCarousel,
} from "@/src/shared/components";
import { toast } from "@/src/shared/components/ui/toast";
import { CHAT_ROUTE, POST_ROUTE } from "@/src/shared/constants";
import { colors, metrics } from "@/src/shared/theme";
import { Nullable } from "@/src/shared/types";
import { formatIsoDate, getSafeText, toTitleCase } from "@/src/shared/utils";
import { useHeaderHeight } from "@react-navigation/elements";
import { BlurView } from "expo-blur";
import { router, Stack } from "expo-router";
import { MotiView } from "moti";
import {
  ArrowLeftIcon,
  ChatCircleDotsIcon,
  ClockIcon,
  CubeIcon,
  DotsThreeCircleIcon,
  EnvelopeIcon,
  ExportIcon,
  IconProps,
  MapPinIcon,
  PaletteIcon,
  PhoneIcon,
  RulerIcon,
  SealCheckIcon,
  ShoppingBagIcon,
  TagIcon,
} from "phosphor-react-native";
import React, { ComponentType, useCallback, useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import MapView from "react-native-maps";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/**
 * Generates Airbnb-style descriptions (approx. 10-15 words).
 * Balanced between minimalist snippets and long narratives.
 */
export const generateRandomDescription = (data: PostItem): string => {
  const {
    itemName,
    category,
    color,
    brand,
    condition,
    material,
    size,
    distinctiveMarks,
  } = data;

  const val = (field: Nullable<string>, fallback = "") => field ?? fallback;

  const templates = [
    () =>
      `A ${val(size).toLowerCase()} ${val(brand)} ${val(itemName)} in ${val(color).toLowerCase()}, featuring a durable ${val(material).toLowerCase()} construction and ${val(condition).toLowerCase()} finish.`,

    () =>
      `This ${val(color).toLowerCase()} ${val(brand)} ${category.toLowerCase()} is easily identified by its ${val(size).toLowerCase()} frame and ${val(distinctiveMarks, "unique design details")}.`,

    () =>
      `${val(condition)} ${val(brand)} ${val(itemName)} made of ${val(material).toLowerCase()}, characterized by its ${val(color).toLowerCase()} palette and ${val(size).toLowerCase()} scale.`,
  ];

  const randomIndex = Math.floor(Math.random() * templates.length);
  return templates[randomIndex]();
};

const AirbnbHeaderIcon = ({
  icon: Icon,
  onPress,
}: {
  icon: ComponentType<IconProps>;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} className="">
      <Animated.View
        style={[
          {
            width: 34,
            height: 34,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(255,255,255,0.2)",
            overflow: "hidden",
            borderRadius: 17,
            borderColor: "rgba(0,0,0,0.1)",
          },
        ]}
      >
        <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
        <Icon size={18} color={colors.text.primary} weight="bold" />
      </Animated.View>
    </TouchableOpacity>
  );
};

type PostDetailScreenProps = {
  postId: string;
};

export const PostDetailScreen = ({ postId }: PostDetailScreenProps) => {
  const insets = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();
  const headerHeight = useHeaderHeight();

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

  const { isLoading, data: post } = useGetPostById({ postId });
  const { similarPosts } = useMatchingPost(postId);

  const { create: createConversation, isCreating } =
    useCreateDirectConversation();

  const [isDismissing, setIsDismissing] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [descriptionIsTruncatable, setDescriptionIsTruncatable] =
    useState(false);

  const handleStartChat = useCallback(async () => {
    if (!post?.author?.id) return;

    try {
      const response = await createConversation({
        memberId: post.author.id,
      });
      const conversationId = response.data?.conversation?.conversationId;
      if (conversationId) {
        setIsDismissing(true);

        if (router.canDismiss()) {
          router.dismiss();
        }

        const path = CHAT_ROUTE.message(conversationId);
        router.push(path);
      }
    } catch {
      toast.error("Failed to start chat. Please try again.");
    }
  }, [post?.author?.id, createConversation]);

  const {
    postImageUrls,
    displayDescription,
    displayAddress,
    displayName,
    displayEventTime,
    itemDetailRows,
  } = useMemo(() => {
    if (!post) {
      return {
        postImageUrls: [] as string[],
        displayDescription: "",
        displayAddress: "Location not specified",
        displayName: "Anonymous",
        displayEventTime: "Event time not specified",
        itemDetailRows: [] as { label: string; value: string }[],
      };
    }

    const { item, author } = post;

    return {
      postImageUrls: post.imageUrls ?? [],
      displayDescription: generateRandomDescription(item),

      displayAddress: toTitleCase(
        post.displayAddress || "Location not specified",
      ),
      displayName: author?.displayName || "Anonymous",
      displayEventTime:
        formatIsoDate(post.eventTime) || "Event time not specified",
      itemDetailRows: [
        { label: "Category", value: toTitleCase(item.category) },
        { label: "Brand", value: getSafeText(item.brand) },
        { label: "Color", value: getSafeText(item.color) },
        { label: "Condition", value: getSafeText(item.condition) },
        { label: "Material", value: getSafeText(item.material) },
        { label: "Size", value: getSafeText(item.size) },
      ],
      hasEmail: !!author?.showEmail && !!author?.email,
      hasPhone: !!author?.showPhone && !!author?.phone,
    };
  }, [post]);

  if (!postId) return <AppInlineError message="Failed to load post details." />;

  const renderBody = () => {
    const isScreenLoading = isLoading || !post;
    if (isScreenLoading) return <AppLoader />;

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
          {/* Title Block */}
          <MotiView
            from={{ opacity: 0, translateY: 8 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 280, delay: 80 }}
          >
            <View className="pt-xl gap-xs px-lg">
              <Text
                className="text-textPrimary font-semibold text-2xl"
                numberOfLines={2}
              >
                {post.item.itemName}
              </Text>

              {/* Vibe Tags */}
              <View className="mt-xs">
                <VibeTagsRow
                  postType={post.postType}
                  category={post.item.category}
                  status={post.postType}
                />
              </View>
            </View>
          </MotiView>

          {/* Divider */}
          <View className="border-t border-muted mx-lg" />

          {/* About this item */}
          <MotiView
            from={{ opacity: 0, translateY: 8 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 240, delay: 140 }}
          >
            <View className="gap-sm px-lg">
              <Text className="text-lg font-semibold text-textPrimary">
                About this item
              </Text>

              {/* Hidden measurer — same styles, no line cap — detects true line count */}
              <View
                pointerEvents="none"
                style={{ position: "absolute", width: "100%", opacity: 0 }}
              >
                <Text
                  className="text-md text-textSecondary leading-6 font-thin"
                  onTextLayout={(e) =>
                    setDescriptionIsTruncatable(e.nativeEvent.lines.length > 3)
                  }
                >
                  {displayDescription}
                </Text>
              </View>

              <Text
                className="text-md text-textSecondary leading-6"
                numberOfLines={isDescriptionExpanded ? undefined : 3}
              >
                {displayDescription}
              </Text>

              {descriptionIsTruncatable && (
                <TouchableOpacity
                  onPress={() => setIsDescriptionExpanded((v) => !v)}
                  className="self-start rounded-sm px-sm py-xs bg-canvas"
                >
                  <Text className="text-base text-textPrimary font-medium">
                    {isDescriptionExpanded ? "Show less" : "Show more"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </MotiView>

          {/* Divider */}
          <View className="border-t border-muted mx-lg" />

          {/* Item Details */}
          <MotiView
            from={{ opacity: 0, translateY: 8 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 240, delay: 200 }}
          >
            <View className="gap-sm px-lg">
              <Text className="text-lg font-semibold text-textPrimary">
                Item Details
              </Text>

              <FeatureBulletRow
                icon={TagIcon}
                label="Category"
                value={itemDetailRows[0]?.value ?? "—"}
              />
              <View className="h-px bg-divider" />
              <FeatureBulletRow
                icon={ShoppingBagIcon}
                label="Brand"
                value={itemDetailRows[1]?.value ?? "—"}
              />
              <View className="h-px bg-divider" />
              <FeatureBulletRow
                icon={PaletteIcon}
                label="Color"
                value={itemDetailRows[2]?.value ?? "—"}
              />
              <View className="h-px bg-divider" />
              <FeatureBulletRow
                icon={SealCheckIcon}
                label="Condition"
                value={itemDetailRows[3]?.value ?? "—"}
              />
              <View className="h-px bg-divider" />
              <FeatureBulletRow
                icon={CubeIcon}
                label="Material"
                value={itemDetailRows[4]?.value ?? "—"}
              />
              <View className="h-px bg-divider" />
              <FeatureBulletRow
                icon={RulerIcon}
                label="Size"
                value={itemDetailRows[5]?.value ?? "—"}
              />
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
              <Text className="text-lg font-semibold text-textPrimary">
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
                style={{ height: 180 }}
              >
                <MapView
                  style={{ flex: 1 }}
                  initialRegion={{
                    latitude: post.location?.latitude,
                    longitude: post.location?.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                  provider="google"
                  scrollEnabled={false}
                  zoomEnabled={false}
                  pitchEnabled={false}
                  rotateEnabled={false}
                >
                  <UserPlaceMarker
                    coordinate={post.location}
                    disabled={false}
                    onPress={() => {}}
                  />
                </MapView>
              </View>
            </View>
          </MotiView>

          {/* Divider */}
          <View className="border-t border-muted mx-lg" />

          {/* Your host */}
          <MotiView
            from={{ opacity: 0, translateY: 8 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 240, delay: 320 }}
          >
            <View className="gap-md px-lg">
              <Text className="text-lg font-semibold text-textPrimary">
                Your host
              </Text>

              {/* Host card */}
              <View
                className="bg-surface border border-divider rounded-xl"
                style={{
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.12,
                  shadowRadius: 6,
                }}
              >
                {/* Avatar + name + message icon */}
                <Pressable
                  className="flex-row items-center gap-md p-md"
                  onPress={() => console.log("Go to host profile")}
                >
                  <View className="relative">
                    <AppUserAvatar
                      avatarUrl={post.author?.avatarUrl}
                      size={60}
                    />

                    <View className="absolute bottom-[-4] right-0 bg-primary rounded-full p-1 border border-divider">
                      <SealCheckIcon
                        size={12}
                        color={colors.white}
                        weight="fill"
                      />
                    </View>
                  </View>

                  {/* Host info */}
                  <View className="flex-1 flex-col gap-xs">
                    <Text className="text-base font-normal text-textPrimary">
                      {displayName}
                    </Text>

                    {/* Contact rows*/}
                    <View className="flex-1 flex-col gap-xs">
                      <View className="flex-row items-center gap-sm">
                        <EnvelopeIcon size={16} color={colors.hof[600]} />
                        <Text className="flex-1 text-sm text-textSecondary">
                          {post.author?.email ?? "Email not available"}
                        </Text>
                      </View>

                      <View className="flex-row items-center gap-sm">
                        <PhoneIcon size={16} color={colors.hof[600]} />
                        <Text className="flex-1 text-sm text-textSecondary">
                          {post.author?.phone ?? "Phone not available"}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Chat icon button */}
                  <TouchableOpacity
                    onPress={handleStartChat}
                    disabled={isCreating}
                    className="p-2 rounded-full border"
                  >
                    <ChatCircleDotsIcon size={24} weight="regular" />
                  </TouchableOpacity>
                </Pressable>
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
                  <Text className="text-lg font-semibold text-textPrimary">
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
                      <SimilarPostCard postId={post.id} matchPost={p} />
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
    router.push(POST_ROUTE.handoverRequest(postId));
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
            <AirbnbHeaderIcon
              icon={ArrowLeftIcon}
              onPress={() => router.back()}
            />
          ),

          headerRight: () => (
            <View>
              <AirbnbHeaderIcon
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
          <Text className="text-base font-semibold text-white">Handover</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

type FeatureBulletRowProps = {
  icon: ComponentType<IconProps>;
  label: string;
  value: string;
};

const FeatureBulletRow = ({
  icon: Icon,
  label,
  value,
}: FeatureBulletRowProps) => (
  <View className="flex-row items-center gap-sm py-sm">
    <Icon size={20} weight="regular" />
    <Text className="flex-1 text-md font-medium text-textPrimary">{label}</Text>
    <Text className="text-sm text-textSecondary">{value}</Text>
  </View>
);

type VibeTagsRowProps = {
  postType: PostType;
  category: string;
  status: PostType;
};

const VibeTagsRow = ({ postType, category }: VibeTagsRowProps) => {
  const categoryInfo =
    CATEGORY_REGISTRY[category as keyof typeof CATEGORY_REGISTRY];
  const CategoryIcon = categoryInfo?.icon ?? DotsThreeCircleIcon;
  const categoryLabel = categoryInfo?.label ?? toTitleCase(category);

  return (
    <View className="flex-row flex-wrap gap-xs">
      {/* Status badge (existing) */}
      <PostStatusBadge status={postType} size="sm" />

      {/* Category pill — icon + label */}
      <View
        className="flex-row rounded-full px-sm py-xs items-center gap-xs"
        style={{
          borderWidth: 1,
          borderColor: colors.border.DEFAULT,
          backgroundColor: colors.canvas,
        }}
      >
        <CategoryIcon size={14} weight="regular" />
        <Text className="text-sm font-medium text-textPrimary">
          {categoryLabel}
        </Text>
      </View>
    </View>
  );
};
