import { useCreateDirectConversation } from "@/src/features/chat/hooks";
import { UserPlaceMarker } from "@/src/features/map/components";
import {
  PostStatusBadge,
  SimilarPostCard,
} from "@/src/features/post/components";
import { useGetPostById, useMatchingPost } from "@/src/features/post/hooks";
import { CATEGORY_REGISTRY } from "@/src/features/post/constants";
import { PostItem, PostType } from "@/src/features/post/types";
import { AppInlineError, AppUserAvatar } from "@/src/shared/components";
import { toast } from "@/src/shared/components/ui/toast";
import { CHAT_ROUTE } from "@/src/shared/constants";
import { colors, metrics, typography } from "@/src/shared/theme";
import { Nullable } from "@/src/shared/types";
import { formatIsoDate, getSafeText, toTitleCase } from "@/src/shared/utils";
import { useHeaderHeight } from "@react-navigation/elements";
import { BlurView } from "expo-blur";
import { router, Stack } from "expo-router";
import { MotiView } from "moti";
import {
  ArrowLeftIcon,
  ChatTeardropDotsIcon,
  ClockIcon,
  CubeIcon,
  DotsThreeCircleIcon,
  EnvelopeIcon,
  ExportIcon,
  IconProps,
  MapPinIcon,
  PackageIcon,
  PaletteIcon,
  PhoneIcon,
  RulerIcon,
  SealCheckIcon,
  ShoppingBagIcon,
  TagIcon,
} from "phosphor-react-native";
import React, { ComponentType, useCallback, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Linking,
  Platform,
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

  const IMAGE_HEIGHT = height * 0.5;

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
            [-IMAGE_HEIGHT, 0, IMAGE_HEIGHT],
            [-IMAGE_HEIGHT / 2, 0, IMAGE_HEIGHT * 0.75],
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-IMAGE_HEIGHT, 0, IMAGE_HEIGHT],
            [2, 1, 1],
          ),
        },
      ],

      opacity: interpolate(
        scrollOffset.value,
        [-IMAGE_HEIGHT, 0, IMAGE_HEIGHT],
        [0, 1, 0],
      ),
    };
  });

  const headerAnimationStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollOffset.value, [0, IMAGE_HEIGHT], [0, 1]);
    return { opacity };
  });

  const { isLoading, data: post } = useGetPostById({ postId });
  const { similarPosts } = useMatchingPost(postId);

  const { create: createConversation, isCreating } =
    useCreateDirectConversation();

  const [isDismissing, setIsDismissing] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [descriptionIsTruncatable, setDescriptionIsTruncatable] = useState(false);

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
    displaySubtitle,
    displayAddress,
    displayName,
    displayEventTime,
    itemDetailRows,
    hasEmail,
    hasPhone,
  } = useMemo(() => {
    if (!post) {
      return {
        postImageUrls: [] as string[],
        displayDescription: "",
        displaySubtitle: "",
        displayAddress: "Location not specified",
        displayName: "Anonymous",
        displayEventTime: "Event time not specified",
        itemDetailRows: [] as { label: string; value: string }[],
        hasEmail: false,
        hasPhone: false,
      };
    }

    const { item, author } = post;

    return {
      postImageUrls: post.imageUrls ?? [],
      displayDescription: generateRandomDescription(item),
      displaySubtitle: [
        toTitleCase(item.category),
        getSafeText(item.condition) !== "—"
          ? getSafeText(item.condition)
          : null,
      ]
        .filter(Boolean)
        .join(" · "),
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

  const handleOpenMaps = useCallback(() => {
    if (!post?.location) return;
    const { latitude, longitude } = post.location;
    const label = encodeURIComponent(displayAddress);
    const url = `maps://?q=${label}&ll=${latitude},${longitude}`;
    Linking.openURL(url).catch(() => {
      Linking.openURL(
        `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
      );
    });
  }, [post?.location, displayAddress]);

  if (!postId) return <AppInlineError message="Failed to load post details." />;

  if (isLoading || !post) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text
          className="text-secondary"
          style={{ fontSize: typography.fontSize.lg }}
        >
          Loading post details...
        </Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          animation: isDismissing ? "none" : "default",
          headerTitle: "",
          headerTransparent: true,
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
        contentContainerStyle={{ paddingBottom: 3 * insets.bottom }}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[{ height: IMAGE_HEIGHT }, imgBgAnimationStyle]}>
          <PhotoCarousel imageUrls={postImageUrls} height={IMAGE_HEIGHT} />
        </Animated.View>

        {/* Post Details */}
        <View
          className="flex-1 bg-surface rounded-t-4xl z-10 px-lg gap-xl"
          style={{ marginTop: -insets.top }}
        >
          {/* Title Block */}
          <MotiView
            from={{ opacity: 0, translateY: 8 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 280, delay: 80 }}
          >
            <View className="pt-xl gap-xs">
              <Text
                className="text-textPrimary font-bold text-2xl"
                style={{ letterSpacing: -0.3 }}
              >
                {post.item.itemName}
              </Text>

              {displaySubtitle ? (
                <Text className="text-base text-textSecondary">
                  {displaySubtitle}
                </Text>
              ) : null}

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
          <View className="border-t border-muted" />

          {/* About this item */}
          <MotiView
            from={{ opacity: 0, translateY: 8 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 240, delay: 140 }}
          >
            <View className="gap-sm">
              <Text className="text-xl font-semibold text-textPrimary">
                About this item
              </Text>

              {/* Hidden measurer — same styles, no line cap — detects true line count */}
              <View
                pointerEvents="none"
                style={{ position: "absolute", width: "100%", opacity: 0 }}
              >
                <Text
                  className="text-base text-textPrimary leading-6"
                  onTextLayout={(e) =>
                    setDescriptionIsTruncatable(
                      e.nativeEvent.lines.length > 3,
                    )
                  }
                >
                  {displayDescription}
                </Text>
              </View>

              <Text
                className="text-base text-textPrimary leading-6"
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
          <View className="border-t border-muted" />

          {/* Item Details */}
          <MotiView
            from={{ opacity: 0, translateY: 8 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 240, delay: 200 }}
          >
            <View className="gap-sm">
              <Text className="text-xl font-semibold text-textPrimary">
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
          <View className="border-t border-muted" />

          {/* Where it's happening */}
          <MotiView
            from={{ opacity: 0, translateY: 8 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 240, delay: 260 }}
          >
            <View className="gap-sm">
              <Text className="text-xl font-semibold text-textPrimary">
                Where it&apos;s happening
              </Text>

              <TouchableOpacity
                onPress={handleOpenMaps}
                activeOpacity={0.85}
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
              </TouchableOpacity>

              <View className="flex-row items-center gap-xs">
                <MapPinIcon
                  size={14}
                  color={colors.hof[400]}
                  weight="regular"
                />
                <Text
                  className="flex-1 text-base text-textSecondary"
                  numberOfLines={2}
                >
                  {displayAddress}
                </Text>
              </View>
            </View>
          </MotiView>

          {/* Divider */}
          <View className="border-t border-muted" />

          {/* Your host */}
          <MotiView
            from={{ opacity: 0, translateY: 8 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 240, delay: 320 }}
          >
            <View className="gap-md">
              <Text className="text-xl font-semibold text-textPrimary">
                Your host
              </Text>

              {/* Elevated host card */}
              <View
                className="bg-surface border border-divider"
                style={[
                  { borderRadius: metrics.borderRadius.primary },
                  Platform.select({
                    ios: {
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.12,
                      shadowRadius: 6,
                    },
                    android: { elevation: 16 },
                  }),
                ]}
              >
                {/* Avatar + name + message icon */}
                <View
                  className="flex-row items-center gap-md"
                  style={{ padding: metrics.spacing.md }}
                >
                  <AppUserAvatar
                    avatarUrl={post.author?.avatarUrl ?? ""}
                    size={56}
                  />
                  <View className="flex-1">
                    <Text className="text-base font-bold text-textPrimary">
                      {displayName}
                    </Text>
                    <View
                      className="flex-row items-center gap-xs"
                      style={{ marginTop: 3 }}
                    >
                      <View
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: 9999,
                          backgroundColor: colors.babu[300],
                        }}
                      />
                      <Text className="text-sm text-textMuted">
                        Active member
                      </Text>
                    </View>
                  </View>
                  {/* Chat icon button */}
                  <TouchableOpacity
                    onPress={handleStartChat}
                    disabled={isCreating}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: isCreating
                        ? colors.hof[200]
                        : colors.primary,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ChatTeardropDotsIcon
                      size={20}
                      color={colors.primaryForeground}
                      weight="fill"
                    />
                  </TouchableOpacity>
                </View>

                {/* Contact rows (conditional) */}
                {(hasEmail || hasPhone) && (
                  <>
                    <View style={{ height: 1 }} className="bg-divider" />
                    <View
                      style={{
                        paddingHorizontal: metrics.spacing.md,
                        paddingVertical: metrics.spacing.sm,
                        gap: metrics.spacing.sm,
                      }}
                    >
                      {hasEmail && (
                        <View className="flex-row items-center gap-sm">
                          <EnvelopeIcon
                            size={16}
                            color={colors.hof[600]}
                            weight="regular"
                          />
                          <Text className="flex-1 text-base text-textPrimary">
                            {post.author?.email}
                          </Text>
                        </View>
                      )}
                      {hasPhone && (
                        <View className="flex-row items-center gap-sm">
                          <PhoneIcon
                            size={16}
                            color={colors.hof[600]}
                            weight="regular"
                          />
                          <Text className="flex-1 text-base text-textPrimary">
                            {post.author?.phone}
                          </Text>
                        </View>
                      )}
                    </View>
                  </>
                )}
              </View>
            </View>
          </MotiView>

          {/* More in this area */}
          <MotiView
            from={{ opacity: 0, translateY: 8 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 240, delay: 380 }}
          >
            {!!similarPosts?.length && (
              <View className="gap-sm">
                <View className="flex-row items-center justify-between">
                  <Text className="text-xl font-semibold text-textPrimary">
                    More in this area
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
                  style={{ marginHorizontal: -metrics.spacing.lg }}
                  contentContainerStyle={{
                    gap: 12,
                    paddingLeft: metrics.spacing.lg,
                    paddingRight: metrics.spacing.lg,
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
      </Animated.ScrollView>

      {/* Footer */}
      <View
        className="flex-row items-center justify-between bg-surface p-md border-t border-muted"
        style={{ paddingBottom: insets.bottom }}
      >
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

        <TouchableOpacity
          onPress={() => router.back()}
          className="px-xl py-3 rounded-full bg-primary"
        >
          <Text className="text-base font-semibold text-white">Handover →</Text>
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
    <Icon size={20} color={colors.hof[600]} weight="regular" />
    <Text className="flex-1 text-base font-medium text-textPrimary">
      {label}
    </Text>
    <Text className="text-sm text-textSecondary">{value}</Text>
  </View>
);

type VibeTagsRowProps = {
  postType: PostType;
  category: string;
  status: PostType;
};

const VibeTagsRow = ({ postType, category }: VibeTagsRowProps) => {
  const isLost = postType === PostType.Lost;

  const typeBg = isLost ? colors.accent : colors.babu[100];
  const typeText = isLost ? colors.accentForeground : colors.babu[500];
  const typeLabel = isLost ? "Lost" : "Found";

  const categoryInfo = CATEGORY_REGISTRY[category as keyof typeof CATEGORY_REGISTRY];
  const CategoryIcon = categoryInfo?.icon ?? DotsThreeCircleIcon;
  const categoryLabel = categoryInfo?.label ?? toTitleCase(category);

  return (
    <View className="flex-row flex-wrap gap-xs">
      {/* Post type pill */}
      <View
        className="rounded-full px-sm py-xs"
        style={{ backgroundColor: typeBg }}
      >
        <Text className="text-sm font-medium" style={{ color: typeText }}>
          {typeLabel}
        </Text>
      </View>

      {/* Category pill — icon + label */}
      <View
        className="flex-row rounded-full px-sm py-xs items-center gap-xs"
        style={{
          borderWidth: 1,
          borderColor: colors.border.DEFAULT,
          backgroundColor: colors.canvas,
        }}
      >
        <CategoryIcon size={14} color={colors.hof[600]} weight="regular" />
        <Text className="text-sm font-medium text-textPrimary">
          {categoryLabel}
        </Text>
      </View>

      {/* Status badge (existing) */}
      <PostStatusBadge status={postType} size="sm" />
    </View>
  );
};

type PhotoCarouselProps = {
  imageUrls: string[];
  height: number;
};

const PhotoCarousel = ({ imageUrls, height }: PhotoCarouselProps) => {
  const { width } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = React.useState(0);

  if (imageUrls.length === 0) {
    return (
      <View
        style={{ height, width }}
        className="bg-canvas items-center justify-center"
      >
        <PackageIcon size={64} color={colors.hof[300]} weight="thin" />
      </View>
    );
  }

  return (
    <View style={{ height, width }}>
      <FlatList
        data={imageUrls}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => String(i)}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            style={{ width, height }}
            resizeMode="cover"
          />
        )}
      />
      {imageUrls.length > 1 && (
        <View
          style={{
            position: "absolute",
            bottom: 12,
            right: 12,
            backgroundColor: "rgba(0,0,0,0.45)",
            borderRadius: 99,
            paddingHorizontal: 8,
            paddingVertical: 4,
          }}
        >
          <Text
            style={{
              color: colors.white,
              fontSize: 13,
              fontWeight: "500",
            }}
          >
            {currentIndex + 1} / {imageUrls.length}
          </Text>
        </View>
      )}
    </View>
  );
};
