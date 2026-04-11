import { useCreateDirectConversation } from "@/src/features/chat/hooks";
import { UserPlaceMarker } from "@/src/features/map/components";
import {
  PostStatusBadge,
  SimilarPostCard,
} from "@/src/features/post/components";
import { useGetPostById, useMatchingPost } from "@/src/features/post/hooks";
import { PostItem, PostType } from "@/src/features/post/types";
import { AppInlineError, AppUserAvatar } from "@/src/shared/components";
import { toast } from "@/src/shared/components/ui/toast";
import { CHAT_ROUTE } from "@/src/shared/constants";
import { colors, typography } from "@/src/shared/theme";
import { Nullable } from "@/src/shared/types";
import { formatIsoDate, getSafeText, toTitleCase } from "@/src/shared/utils";
import { useHeaderHeight } from "@react-navigation/elements";
import { BlurView } from "expo-blur";
import { router, Stack } from "expo-router";
import {
  ArrowLeftIcon,
  ClockIcon,
  EnvelopeIcon,
  ExportIcon,
  IconProps,
  MapPinIcon,
  PhoneIcon,
  SparkleIcon,
  TagIcon,
  UserIcon,
} from "phosphor-react-native";
import React, { ComponentType, useCallback, useMemo, useState } from "react";
import {
  ImageBackground,
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

const SectionTitle = ({
  title,
  icon: Icon,
}: {
  title: string;
  icon: React.ComponentType<any>;
}) => {
  return (
    <View className="flex-row items-center">
      <Icon size={24} color={colors.secondary} weight="regular" />
      <Text className="text-xl text-textPrimary font-normal ml-2">{title}</Text>
    </View>
  );
};

const AirbnbHeaderIcon = ({
  icon: Icon,
  onPress,
}: {
  icon: React.ComponentType<any>;
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
  const { height } = useWindowDimensions();
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
  const [isItemInfoExpanded, setIsItemInfoExpanded] = useState(false);

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
    displayRole,
    hasEmail,
    hasPhone,
  } = useMemo(() => {
    if (!post) {
      return {
        postImageUrls: [] as string[],
        displayDescription: "",
        displayAddress: "Location not specified",
        displayName: "Anonymous",
        displayEventTime: "Event time not specified",
        displayRole: "Unknown",
        itemDetailRows: [] as { label: string; value: string }[],
        hasEmail: false,
        hasPhone: false,
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
      displayRole: post.postType === PostType.Found ? "Finder" : "Owner",
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
          className="flex-1 bg-surface rounded-t-4xl z-10 px-xl gap-md"
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
          <View className="border-t border-muted" />

          {/* Post Info Table  */}
          <View className="gap-md">
            <SectionTitle title="General Info" icon={TagIcon} />

            <View className="overflow-hidden bg-canvas">
              {itemDetailRows.map((row, index) => (
                <React.Fragment key={row.label}>
                  <View className="flex-row items-center px-md py-sm">
                    <Text className="flex-1 text-sm font-medium text-textPrimary">
                      {row.label}
                    </Text>
                    <Text className="text-sm text-textSecondary">
                      {row.value}
                    </Text>
                  </View>
                  {index < itemDetailRows.length - 1 && (
                    <View className="mx-md h-px bg-divider" />
                  )}
                </React.Fragment>
              ))}
            </View>
          </View>

          {/* Divider */}
          <View className="border-t border-muted" />

          {/* Location Info Section */}
          <View className="gap-md">
            <SectionTitle title="Last known location" icon={MapPinIcon} />

            <View className="flex-row items-start gap-2">
              <Text className="flex-1 text-sm font-normal text-textMuted">
                {displayAddress}
              </Text>
            </View>

            <View
              className="overflow-hidden rounded-2xl"
              style={{ height: height * 0.5 }}
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
              >
                <UserPlaceMarker
                  coordinate={post.location}
                  disabled={false}
                  onPress={() => {}}
                />
              </MapView>
            </View>
          </View>

          {/* Divider */}
          <View className="border-t border-muted" />

          {/* Meet your host section*/}
          <View className="gap-md">
            <SectionTitle title="Meet your host" icon={UserIcon} />

            {/* Host Info Card */}
            <View
              className="items-center rounded-2xl bg-surface px-md py-md"
              style={{
                shadowColor: colors.black,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.12,
                shadowRadius: 12,
                elevation: 4,
              }}
            >
              {/* Avatar */}
              <AppUserAvatar avatarUrl={post.author?.avatarUrl} size={80} />

              {/* Name + Role */}
              <Text className="text-lg font-bold text-textPrimary mt-md">
                {displayName}
              </Text>
              <Text className="text-sm text-textSecondary mt-xs">
                {displayRole}
              </Text>
            </View>

            {/* Contact Info */}
            <View className="w-full gap-sm">
              <HostInfoRow
                icon={EnvelopeIcon}
                label={post.author?.email ?? "No email provided"}
              />
              <HostInfoRow
                icon={PhoneIcon}
                label={post.author?.phone ?? "No phone provided"}
              />
            </View>

            <View className="w-full">
              <TouchableOpacity
                onPress={handleStartChat}
                className="flex-row items-center justify-center py-3 rounded-lg bg-canvas"
              >
                <Text className="text-sm font-normal text-secondary">
                  Message Host
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Similar Posts */}
          {!!similarPosts?.length && (
            <View className="pt-sm gap-sm">
              <SectionTitle title="Suggestions" icon={SparkleIcon} />

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

      {/* Footer */}
      <View
        className="flex-row items-center justify-between bg-surface p-md border-t border-muted"
        style={{ paddingBottom: insets.bottom }}
      >
        <View className="flex-col items-center flex-1 pr-md">
          <View className="mt-1.5 flex-row items-center gap-1.5 pr-2">
            <ClockIcon size={16} color={colors.secondary} weight="regular" />
            <Text
              className="flex-1 text-sm font-normal text-textPrimary"
              numberOfLines={1}
            >
              {displayEventTime}
            </Text>
          </View>

          <View className="mt-1.5 flex-row items-center gap-1.5 pr-2">
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
          className="px-md py-md2 rounded-full bg-primary"
        >
          <Text className="text-sm font-normal text-white">Handover</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

type HostInfoRowProps = {
  icon: ComponentType<IconProps>;
  label: string;
};

const HostInfoRow = ({ icon: Icon, label }: HostInfoRowProps) => (
  <View className="flex-row items-center gap-md">
    <Icon size={24} color={colors.black} />
    <Text className="flex-1 text-base font-thin text-textPrimary">{label}</Text>
  </View>
);
