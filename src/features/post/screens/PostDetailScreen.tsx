import { UserPlaceMarker } from "@/src/features/map/components";
import {
  PostInfoRow,
  PostStatusBadge,
  SimilarPostCard,
} from "@/src/features/post/components";
import { useGetPostById, useMatchingPost } from "@/src/features/post/hooks";
import { PostItem, PostType } from "@/src/features/post/types";
import { AppInlineError, AppUserAvatar } from "@/src/shared/components";
import { colors, typography } from "@/src/shared/theme";
import { Nullable } from "@/src/shared/types";
import { formatIsoDate, getSafeText, toTitleCase } from "@/src/shared/utils";
import { useHeaderHeight } from "@react-navigation/elements";
import { BlurView } from "expo-blur";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { View } from "moti";
import {
  ArrowLeftIcon,
  CalendarIcon,
  ExportIcon,
  MapPinIcon,
} from "phosphor-react-native";
import React, { useMemo, useRef } from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import MapView from "react-native-maps";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollOffset,
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

const SectionTitle = ({ title }: { title: string }) => {
  return (
    <Text className="text-xs text-textPrimary font-semibold">{title}</Text>
  );
};

const AirbnbHeaderIcon = ({
  icon: Icon,
  onPress,
  style,
}: {
  icon: React.ComponentType<any>;
  onPress: () => void;
  style: any;
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
        <BlurView
          intensity={80}
          tint="light"
          style={[StyleSheet.absoluteFill, style]}
        />
        <Icon size={18} color={colors.text.primary} weight="bold" />
      </Animated.View>
    </TouchableOpacity>
  );
};

export const PostDetailScreen = () => {
  const params = useLocalSearchParams<{ postId: string }>();

  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const headerHeight = useHeaderHeight();

  const IMAGE_HEIGHT = height * 0.5;

  const mapRef = useRef<MapView>(null);

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollOffset(scrollRef);

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

  const iconAnimationStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollOffset.value, [0, IMAGE_HEIGHT], [1, 0]);
    return { opacity };
  });

  const postId = params.postId;

  const { isLoading, data: post } = useGetPostById({ postId });
  const { similarPosts } = useMatchingPost(postId);

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

    const { item } = post;

    return {
      postImageUrls: post.imageUrls ?? [],
      displayDescription: generateRandomDescription(item),
      displayAddress: post.displayAddress || "Location not specified",
      displayName: post.author?.displayName || "Anonymous",
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
    };
  }, [post]);

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
          headerShown: true,
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
              style={iconAnimationStyle}
            />
          ),

          headerRight: () => (
            <AirbnbHeaderIcon
              icon={ExportIcon}
              onPress={() => console.log("Export")}
              style={iconAnimationStyle}
            />
          ),
        }}
      />

      <Animated.ScrollView
        ref={scrollRef}
        className="flex-1 bg-surface"
        contentContainerStyle={{ paddingBottom: 3 * insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            {
              height: IMAGE_HEIGHT,
            },
            imgBgAnimationStyle,
          ]}
        >
          <ImageBackground
            source={{ uri: postImageUrls[0] }}
            className="w-full h-full"
          />
        </Animated.View>

        {/* Post Details */}
        <View
          className="flex-1 bg-surface rounded-t-4xl z-10 px-xl"
          style={{ marginTop: -insets.top }}
        >
          {/* Title Details */}
          <View className="pt-xl gap-sm">
            <View>
              <Text
                className="text-textPrimary text-center font-normal text-2xl"
                style={{
                  lineHeight: typography.lineHeight["2xl"],
                  letterSpacing: typography.letterSpacing.heading,
                }}
              >
                {post.item.itemName}
              </Text>

              <Text
                className="text-textSecondary text-center font-thin text-md leading-6"
                style={{
                  lineHeight: typography.lineHeight["body"],
                  letterSpacing: typography.letterSpacing.heading,
                }}
              >
                {displayDescription}
              </Text>
            </View>

            {/* Badge Container  */}
            <View className="flex-row items-center justify-center mt-sm">
              <PostStatusBadge status={post.postType} size={"md"} />
            </View>
          </View>

          {/* Divider */}
          <View className="border-t border-muted my-4" />

          {/* Avatar rows */}
          <View className="gap-sm">
            <SectionTitle title="Posted by" />

            <PostInfoRow
              icon={
                <AppUserAvatar avatarUrl={post.author?.avatarUrl} size={40} />
              }
              title={displayName}
              subTitle={formatIsoDate(post.createdAt)}
            />
          </View>

          {/* Divider */}
          <View className="border-t border-muted my-4" />

          {/* Post Info rows */}
          <View className="gap-md">
            <SectionTitle title="Time & Place" />

            <PostInfoRow
              icon={
                <CalendarIcon
                  size={36}
                  color={colors.secondary}
                  weight="thin"
                />
              }
              title="Event time"
              subTitle={displayEventTime}
            />

            <PostInfoRow
              icon={
                <MapPinIcon size={36} color={colors.secondary} weight="thin" />
              }
              title="Location"
              subTitle={displayAddress}
            />
          </View>

          {/* Divider */}
          <View className="border-t border-muted my-4" />

          {/* Post Info Table */}
          <View className="gap-4">
            <View className="flex-row flex-wrap">
              {itemDetailRows.map((row) => (
                <View key={row.label} className="w-1/2 mb-4 pr-4">
                  <Text className="text-normal font-normal text-textPrimary mb-1">
                    {row.label}
                  </Text>

                  <Text className="text-sm font-normal text-textMuted">
                    {row.value}
                  </Text>

                  {/* <View className="h-[0.5px] bg-divider mt-3 w-full opacity-50" /> */}
                </View>
              ))}
            </View>
          </View>

          {/* Divider */}
          <View className="border-t border-muted my-4" />

          {/* Location Info Section */}
          <View className="gap-sm">
            <SectionTitle
              title={`Where ${post.item.itemName} ${post.postType === PostType.Found ? "found" : "lost"}`}
            />

            <View
              className="overflow-hidden rounded-2xl"
              style={{ height: height * 0.5 }}
            >
              <MapView
                ref={mapRef}
                style={{ flex: 1 }}
                initialRegion={{
                  latitude: post.location?.latitude,
                  longitude: post.location?.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                provider="google"
              >
                <UserPlaceMarker
                  coordinate={post.location}
                  disabled={false}
                  onPress={() => {}}
                />
              </MapView>
            </View>
          </View>

          {/* Similar Posts */}
          {!!similarPosts?.length && (
            <View className="pt-sm gap-sm">
              <SectionTitle title="Suggestions" />

              <Text className="text-base font-extrabold text-textPrimary">
                Some similar posts you might want to check out
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
    </>
  );
};
