import {
  PostCategoryBadge,
  PostSubcategoryBadge,
  PostTypeIconBadge,
  SimilarPostCard,
} from "@/src/features/post/components";
import {
  useDeletePost,
  useGetPostById,
  useMatchingPost,
} from "@/src/features/post/hooks";
import { usePostSubcategoryStore } from "@/src/features/post/store";
import { ELECTRONICS_SUBCATEGORY } from "@/src/features/post/types";
import {
  AppLoader,
  ImageCarousel,
  MenuBottomSheet,
  type MenuOption,
} from "@/src/shared/components";
import { PROFILE_ROUTE } from "@/src/shared/constants";
import { colors, metrics } from "@/src/shared/theme";
import { formatIsoDate, toTitleCase } from "@/src/shared/utils";
import { useHeaderHeight } from "@react-navigation/elements";
import { BlurView } from "expo-blur";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { MotiView, ScrollView } from "moti";
import {
  ArrowLeftIcon,
  ArrowsOutCardinalIcon,
  BookmarkSimpleIcon,
  CalendarDotsIcon,
  CertificateIcon,
  CheckCircleIcon,
  CirclesThreeIcon,
  ClockIcon,
  CpuIcon,
  DeviceMobileIcon,
  DotsThreeVerticalIcon,
  ExportIcon,
  FingerprintIcon,
  HandbagIcon,
  HashStraightIcon,
  HeadphonesIcon,
  IconProps,
  IdentificationCardIcon,
  ListBulletsIcon,
  LockKeyIcon,
  MapPinIcon,
  NotebookIcon,
  PaletteIcon,
  PencilSimpleIcon,
  TagIcon,
  TrademarkIcon,
  TrashIcon,
  UsbIcon,
  UserCircleIcon,
  WatchIcon,
} from "phosphor-react-native";
import React, { ComponentType, useCallback, useMemo, useState } from "react";
import {
  Alert,
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

export const MyPostDetailScreen = () => {
  const { postId } = useLocalSearchParams<{ postId: string }>();
  const { isLoading, data: post } = useGetPostById({ postId });
  const {
    deletePost,
    error: deletePostError,
    isDeletingPost,
  } = useDeletePost();
  const { similarPosts } = useMatchingPost(post?.id);

  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { height, width } = useWindowDimensions();
  const [isActionSheetVisible, setIsActionSheetVisible] = useState(false);

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

  const handleBackPress = useCallback(() => {
    router.back();
  }, []);

  const handleSharePress = useCallback(() => {
    // TODO: Implement share functionality (e.g., share post details or deep link)
  }, []);

  const handleMorePress = useCallback(() => {
    setIsActionSheetVisible(true);
  }, []);

  const handleCloseActionSheet = useCallback(() => {
    setIsActionSheetVisible(false);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (!postId || isDeletingPost) return;

    void (async () => {
      try {
        await deletePost({ postId });
        router.back();
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : deletePostError?.message || "Delete post failed";

        Alert.alert("Delete Failed", message);
      }
    })();
  }, [deletePost, deletePostError?.message, isDeletingPost, postId]);

  const handleDeletePress = useCallback(() => {
    if (isDeletingPost) return;

    handleCloseActionSheet();
    Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: handleDeleteConfirm,
      },
    ]);
  }, [handleCloseActionSheet, handleDeleteConfirm, isDeletingPost]);

  const actionMenuOptions = useMemo<MenuOption[]>(
    () => [
      {
        id: "edit-post",
        label: "Edit",
        description: "Update this post later",
        icon: PencilSimpleIcon,
        onPress: handleCloseActionSheet,
      },
      {
        id: "delete-post",
        label: "Delete",
        description: "Remove this post permanently",
        icon: TrashIcon,
        onPress: handleDeletePress,
      },
    ],
    [handleCloseActionSheet, handleDeletePress],
  );

  const { displayAddress } = useMemo(() => {
    if (!post) {
      return {
        displayAddress: "Location not specified",
        displayEventTime: "Event time not specified",
      };
    }

    return {
      displayAddress: toTitleCase(
        post.displayAddress || "Location not specified",
      ),
      displayEventTime:
        formatIsoDate(post.eventTime) || "Event time not specified",
    };
  }, [post]);

  const displayPostTitle = useMemo(() => {
    return post?.postTitle || "Untitled item";
  }, [post]);

  const displayImageUrls = useMemo(() => {
    return post?.imageUrls ?? [];
  }, [post]);

  const subcategoryCode = usePostSubcategoryStore(
    useCallback(
      (state) => {
        if (!post?.subcategoryId) return undefined;
        return state.findSubcategoryById(post.subcategoryId)?.code;
      },
      [post?.subcategoryId],
    ),
  );

  const itemDetailRows = useMemo<ItemDetailRow[]>(() => {
    const rows: ItemDetailRow[] = [];

    const pushRow = (
      icon: ComponentType<IconProps>,
      label: string,
      value: string | boolean | Date | null | undefined,
    ) => {
      if (typeof value === "boolean") {
        rows.push({ icon, label, value: value ? "Yes" : "No" });
        return;
      }

      if (value instanceof Date) {
        const formattedValue = formatIsoDate(value);
        if (!formattedValue) return;
        rows.push({ icon, label, value: formattedValue });
        return;
      }

      if (typeof value === "string") {
        const trimmedValue = value.trim();
        if (!trimmedValue) return;
        rows.push({ icon, label, value: trimmedValue });
        return;
      }

      if (value == null) return;

      const normalizedValue = String(value).trim();
      if (!normalizedValue) return;

      rows.push({ icon, label, value: normalizedValue });
    };

    if (post?.personalBelongingDetail) {
      const detail = post?.personalBelongingDetail;
      pushRow(TagIcon, "Name", detail.itemName);
      pushRow(PaletteIcon, "Color", detail.color);
      pushRow(TrademarkIcon, "Brand", detail.brand);
      pushRow(CirclesThreeIcon, "Material", detail.material);
      pushRow(ArrowsOutCardinalIcon, "Size", detail.size);
      pushRow(CheckCircleIcon, "Condition", detail.condition);
      pushRow(FingerprintIcon, "Marks", detail.distinctiveMarks);
      pushRow(ListBulletsIcon, "Details", detail.additionalDetails);
      return rows;
    }

    if (post?.cardDetail) {
      const detail = post?.cardDetail;
      pushRow(IdentificationCardIcon, "Name", detail.itemName);
      pushRow(UserCircleIcon, "Holder", detail.holderName);
      pushRow(HashStraightIcon, "Card no.", detail.cardNumberMasked);
      pushRow(CalendarDotsIcon, "DOB", detail.dateOfBirth);
      pushRow(CalendarDotsIcon, "Issued", detail.issueDate);
      pushRow(CalendarDotsIcon, "Expires", detail.expiryDate);
      pushRow(CertificateIcon, "Authority", detail.issuingAuthority);
      pushRow(ListBulletsIcon, "Details", detail.additionalDetails);
      return rows;
    }

    if (post?.electronicDetail) {
      const detail = post?.electronicDetail;
      const electronicIcon = getElectronicFieldIcon(post?.subcategoryId);

      pushRow(electronicIcon, "Name", detail.itemName);
      pushRow(TrademarkIcon, "Brand", detail.brand);
      pushRow(CpuIcon, "Model", detail.model);
      pushRow(PaletteIcon, "Color", detail.color);
      pushRow(HandbagIcon, "Has case", detail.hasCase);
      pushRow(HandbagIcon, "Case", detail.caseDescription);
      pushRow(electronicIcon, "Screen", detail.screenCondition);
      pushRow(LockKeyIcon, "Lock screen", detail.lockScreenDescription);
      pushRow(BookmarkSimpleIcon, "Features", detail.distinguishingFeatures);
      pushRow(ListBulletsIcon, "Details", detail.additionalDetails);
      return rows;
    }

    if (post?.otherDetail) {
      const detail = post?.otherDetail;
      pushRow(TagIcon, "Identifier", detail.itemIdentifier);
      pushRow(PaletteIcon, "Color", detail.primaryColor);
      pushRow(ListBulletsIcon, "Details", detail.additionalDetails);
    }

    return rows;
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

  const renderContent = () => {
    if (isLoading || !post) return <AppLoader />;

    const { formattedDate, formattedTime } = formatEventDate(post.eventTime);

    return (
      <Animated.ScrollView
        className="flex-1 bg-surface"
        contentContainerStyle={{ paddingBottom: insets.bottom }}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* Carousel */}
        <Animated.View
          style={[{ height: CAROUSEL_HEIGHT }, imgBgAnimationStyle]}
        >
          <ImageCarousel
            imageUrls={displayImageUrls}
            height={CAROUSEL_HEIGHT}
            width={CAROUSEL_WIDTH}
          />
        </Animated.View>

        {/* Post Information */}
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
              <Text className="text-textPrimary font-normal text-2xl text-center">
                {displayPostTitle}
              </Text>

              {/* Badges */}
              <View className="flex-row items-center gap-sm">
                {/* Post Type Badge */}
                <PostTypeIconBadge status={post.postType} size="xs" />

                {/* Category Badge */}
                <PostCategoryBadge category={post.category} />

                {/* Subcategory Badge */}
                {subcategoryCode && (
                  <PostSubcategoryBadge subcategory={subcategoryCode} />
                )}
              </View>
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
              <Text className="text-lg font-normal text-textPrimary">
                Item Details
              </Text>

              {itemDetailRows.length > 0 ? (
                <View>
                  {itemDetailRows.map((row) => (
                    <FeatureBulletRow
                      key={`${row.label}-${row.value}`}
                      icon={row.icon}
                      label={row.label}
                      value={row.value}
                    />
                  ))}
                </View>
              ) : (
                <Text className="text-sm text-textSecondary">
                  No item details available.
                </Text>
              )}
            </View>
          </MotiView>

          {/* Divider */}
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
                style={{ height: 360 }}
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
                      <SimilarPostCard
                        matchPost={p}
                        onPress={() => {
                          router.push(PROFILE_ROUTE.detailMatch(post.id, p.id));
                        }}
                      />
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}
          </MotiView>
        </View>
      </Animated.ScrollView>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
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
            <HeaderIcon icon={ArrowLeftIcon} onPress={handleBackPress} />
          ),

          headerRight: () => (
            <View className="flex-row items-center gap-sm">
              <HeaderIcon icon={ExportIcon} onPress={handleSharePress} />

              <HeaderIcon
                icon={DotsThreeVerticalIcon}
                onPress={handleMorePress}
              />
            </View>
          ),
        }}
      />
      {renderContent()}
      <MenuBottomSheet
        isVisible={isActionSheetVisible}
        onClose={handleCloseActionSheet}
        options={actionMenuOptions}
      />
    </>
  );
};

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

type ItemDetailRow = {
  icon: ComponentType<IconProps>;
  label: string;
  value: string;
};

const getElectronicFieldIcon = (
  subcategoryId: string,
): ComponentType<IconProps> => {
  switch (subcategoryId) {
    case ELECTRONICS_SUBCATEGORY.LAPTOP:
      return NotebookIcon;
    case ELECTRONICS_SUBCATEGORY.SMARTWATCH:
      return WatchIcon;
    case ELECTRONICS_SUBCATEGORY.HEADPHONE:
    case ELECTRONICS_SUBCATEGORY.EARPHONE:
      return HeadphonesIcon;
    case ELECTRONICS_SUBCATEGORY.CHARGER_ADAPTER:
    case ELECTRONICS_SUBCATEGORY.POWERBANK:
    case ELECTRONICS_SUBCATEGORY.POWER_OUTLET:
      return UsbIcon;
    case ELECTRONICS_SUBCATEGORY.PHONE:
    case ELECTRONICS_SUBCATEGORY.MOUSE:
    case ELECTRONICS_SUBCATEGORY.KEYBOARD:
    default:
      return DeviceMobileIcon;
  }
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
