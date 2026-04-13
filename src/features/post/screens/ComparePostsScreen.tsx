import { useCreateDirectConversation } from "@/src/features/chat/hooks";
import {
  PostMatchingScoreBadge,
  PostStatusBadge,
} from "@/src/features/post/components";
import { useGetPostById, useMatchingPost } from "@/src/features/post/hooks";
import type { Post, SimilarPost } from "@/src/features/post/types";
import { PostType } from "@/src/features/post/types";

import {
  AppAccordion,
  AppHeader,
  AppInlineError,
  AppSplashScreen,
  CloseButton,
  HeaderTitle,
} from "@/src/shared/components";
import { CHAT_ROUTE } from "@/src/shared/constants";
import { colors, metrics } from "@/src/shared/theme";
import { formatDateTime } from "@/src/shared/utils";
import { router } from "expo-router";
import { MotiView } from "moti";
import {
  CaretDownIcon,
  MapPinIcon,
  SparkleIcon,
  TagIcon,
} from "phosphor-react-native";
import React, { useMemo, useState } from "react";
import {
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ComparePostsScreenProps {
  postId: string;
  otherPostId: string;
}

type ComparisonRow = {
  attribute: string;
  post1Value: string;
  post2Value: string;
};

type Category = {
  id: string;
  title: string;
  icon: React.ReactNode;
  rows: ComparisonRow[];
};

// ─── Shared card style ────────────────────────────────────────────────────────

const cardStyle = {
  backgroundColor: colors.surface,
  borderRadius: metrics.borderRadius.md,
  overflow: "hidden" as const,
  borderWidth: 1,
  borderColor: colors.divider,
  ...(Platform.OS === "ios"
    ? metrics.shadows.md.ios
    : metrics.shadows.md.android),
};

// ─── ComparisonRowItem ────────────────────────────────────────────────────────

const ComparisonRowItem = ({
  attribute,
  post1Value,
  post2Value,
}: ComparisonRow) => (
  <View className="flex-row items-start py-2.5 px-3">
    <View style={{ flex: 3 }}>
      <Text
        className="text-xs font-bold"
        style={{ color: colors.text.primary }}
      >
        {attribute}
      </Text>
    </View>
    <View style={{ flex: 3.5 }} className="items-start px-1">
      <Text className="text-xs" style={{ color: colors.text.secondary }}>
        {post1Value}
      </Text>
    </View>
    <View style={{ flex: 3.5 }} className="items-start px-1">
      <Text className="text-xs" style={{ color: colors.text.secondary }}>
        {post2Value}
      </Text>
    </View>
  </View>
);

// ─── CategoryAppAccordion ─────────────────────────────────────────────────────

const CategoryAppAccordion = ({ title, icon, rows }: Omit<Category, "id">) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View className="mb-3" style={cardStyle}>
      <AppAccordion
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded((prev) => !prev)}
        collapsedContent={
          <View className="flex-row items-center px-4 py-3.5 gap-3">
            {icon}
            <Text
              className="font-bold text-base flex-1"
              style={{ color: colors.text.primary }}
            >
              {title}
            </Text>
            <MotiView
              animate={{ rotate: isExpanded ? "180deg" : "0deg" }}
              transition={{ type: "timing", duration: 250 }}
            >
              <CaretDownIcon size={16} color={colors.hof[400]} />
            </MotiView>
          </View>
        }
        expandedContent={
          <View
            style={{
              backgroundColor: colors.muted,
              borderTopWidth: 1,
              borderTopColor: colors.divider,
            }}
          >
            {rows.map((row, index) => (
              <React.Fragment key={row.attribute}>
                <ComparisonRowItem {...row} />
                {index < rows.length - 1 && (
                  <View
                    className="mx-3 h-px"
                    style={{ backgroundColor: colors.divider }}
                  />
                )}
              </React.Fragment>
            ))}
          </View>
        }
      />
    </View>
  );
};

// ─── HeroImage ────────────────────────────────────────────────────────────────

const HeroImage = ({
  imageUrl,
  postType,
  itemName,
}: {
  imageUrl?: string;
  postType: PostType;
  itemName: string;
}) => {
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          borderRadius: metrics.borderRadius.md,
          overflow: "hidden",
          aspectRatio: 1,
          borderWidth: 1,
          borderColor: colors.divider,
        }}
      >
        <Image
          source={{ uri: imageUrl }}
          className="w-full h-full"
          resizeMode="cover"
        />
        <View className="absolute top-2 left-2">
          <PostStatusBadge status={postType} size="sm" />
        </View>
      </View>
      <Text
        className="mt-2 text-sm font-semibold"
        style={{ color: colors.text.primary }}
        numberOfLines={2}
      >
        {itemName}
      </Text>
    </View>
  );
};

// ─── buildCategories ─────────────────────────────────────────────────────────

const formatTimeGap = (days: number): string => {
  if (days === 0) return "Same day";
  return `${days} day${days > 1 ? "s" : ""} apart`;
};

const formatDistance = (meters?: number): string => {
  if (meters == null) return "—";
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
};

const buildCategories = (post1: Post, post2: SimilarPost): Category[] => {
  return [
    {
      id: "general",
      title: "General Info",
      icon: <TagIcon size={20} color={colors.hof[600]} weight="fill" />,
      rows: [
        {
          attribute: "Name",
          post1Value: post1.item.itemName,
          post2Value: post2.item.itemName,
        },
        {
          attribute: "Category",
          post1Value: post1.item.category,
          post2Value: post2.item.category,
        },
        {
          attribute: "Type",
          post1Value: post1.postType,
          post2Value: post2.postType,
        },
        {
          attribute: "Description",
          post1Value: post1.description ?? "—",
          post2Value: post2.description ?? "—",
        },
        {
          attribute: "Address",
          post1Value: post1.displayAddress ?? "—",
          post2Value: post2.displayAddress ?? "—",
        },
        {
          attribute: "Event Time",
          post1Value: formatDateTime(post1.eventTime),
          post2Value: formatDateTime(post2.eventTime),
        },
        {
          attribute: "Time Gap",
          post1Value: "—",
          post2Value: formatTimeGap(post2.timeGapDays),
        },
      ],
    },
  ];
};

// ─── ComparePostsScreen ───────────────────────────────────────────────────────

export const ComparePostsScreen = ({
  postId,
  otherPostId,
}: ComparePostsScreenProps) => {
  const {
    similarPosts,
    isLoading: isLoadingMatch,
    error,
  } = useMatchingPost(postId);
  const { data: post1, isLoading: isLoadingPost1 } = useGetPostById({ postId });
  const { create } = useCreateDirectConversation();

  const matchedPost = useMemo(
    () => similarPosts.find((p) => p.id === otherPostId),
    [similarPosts, otherPostId],
  );

  const categories = useMemo(
    () => (post1 && matchedPost ? buildCategories(post1, matchedPost) : []),
    [post1, matchedPost],
  );

  const handleContactAuthor = async () => {
    try {
      const req = { memberId: "asfsadf" };
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

  if (isLoadingMatch || isLoadingPost1) return <AppSplashScreen />;

  if (error || !matchedPost || !post1) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.canvas }}>
        <AppHeader
          left={<CloseButton />}
          center={
            <HeaderTitle title="Compare Items" className="items-center" />
          }
        />
        <AppInlineError message="Could not load comparison details." />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.canvas }}
      edges={["top", "left", "right"]}
    >
      <AppHeader
        left={<CloseButton />}
        center={<HeaderTitle title="Compare Items" className="items-center" />}
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-4 pb-8">
          {/* ── Hero: Images + Item Names ── */}
          <View className="flex-row gap-3 mb-4">
            <MotiView
              from={{ opacity: 0, translateY: 20, scale: 0.98 }}
              animate={{ opacity: 1, translateY: 0, scale: 1 }}
              transition={{ type: "spring", damping: 18, stiffness: 150 }}
              style={{ flex: 1 }}
            >
              <HeroImage
                imageUrl={post1.imageUrls[0]}
                postType={post1.postType}
                itemName={post1.item.itemName}
              />
            </MotiView>
            <MotiView
              from={{ opacity: 0, translateY: 20, scale: 0.98 }}
              animate={{ opacity: 1, translateY: 0, scale: 1 }}
              transition={{
                type: "spring",
                damping: 18,
                stiffness: 150,
                delay: 80,
              }}
              style={{ flex: 1 }}
            >
              <HeroImage
                imageUrl={matchedPost.imageUrls[0]}
                postType={matchedPost.postType}
                itemName={matchedPost.item.itemName}
              />
            </MotiView>
          </View>

          {/* ── Assessment Summary ── */}
          {matchedPost.assessmentSummary && (
            <MotiView
              from={{ opacity: 0, translateY: 16 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 280, delay: 160 }}
            >
              <View className="mb-3" style={cardStyle}>
                {/* Header bar */}
                <View
                  className="flex-row items-center px-4 py-3 gap-2.5"
                  style={{ backgroundColor: colors.info[50] }}
                >
                  <View
                    className="w-8 h-8 rounded-full items-center justify-center"
                    style={{ backgroundColor: colors.info[100] }}
                  >
                    <SparkleIcon
                      size={16}
                      color={colors.info[500]}
                      weight="fill"
                    />
                  </View>
                  <Text
                    className="font-bold text-sm flex-1"
                    style={{ color: colors.info[500] }}
                  >
                    AI Assessment
                  </Text>
                  <MotiView
                    from={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      type: "spring",
                      damping: 14,
                      stiffness: 200,
                      delay: 400,
                    }}
                  >
                    <PostMatchingScoreBadge level={matchedPost.matchingLevel} />
                  </MotiView>
                </View>

                {/* Body */}
                <View
                  className="px-4 py-3.5 border-t"
                  style={{ borderColor: colors.info[100] }}
                >
                  <Text
                    className="text-sm leading-6"
                    style={{ color: colors.text.secondary }}
                  >
                    {matchedPost.assessmentSummary}
                  </Text>
                </View>
              </View>
            </MotiView>
          )}

          {/* ── Comparison Categories ── */}
          {categories.map((category, index) => (
            <MotiView
              key={category.id}
              from={{ opacity: 0, translateY: 16 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{
                type: "timing",
                duration: 260,
                delay: 200 + index * 60,
              }}
            >
              <CategoryAppAccordion {...category} />
            </MotiView>
          ))}

          {/* ── Location row ── */}
          <MotiView
            from={{ opacity: 0, translateY: 16 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 260, delay: 260 }}
          >
            <View className="mb-3" style={cardStyle}>
              <View className="flex-row items-center px-4 py-3.5 gap-3">
                <MapPinIcon
                  size={20}
                  color={colors.babu[400]}
                  weight="fill"
                />
                <Text
                  className="font-bold text-base flex-1"
                  style={{ color: colors.text.primary }}
                >
                  Location
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: colors.muted,
                  borderTopWidth: 1,
                  borderTopColor: colors.divider,
                }}
              >
                <ComparisonRowItem
                  attribute="Address"
                  post1Value={post1.displayAddress ?? "—"}
                  post2Value={matchedPost.displayAddress ?? "—"}
                />
                <View className="mx-3 h-px" style={{ backgroundColor: colors.divider }} />
                <ComparisonRowItem
                  attribute="Distance"
                  post1Value="—"
                  post2Value={formatDistance(matchedPost.distanceInMeters)}
                />
              </View>
            </View>
          </MotiView>
        </View>
      </ScrollView>

      {/* ── Bottom Action Bar ── */}
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 280, delay: 80 }}
      >
        <View
          className="border-t px-4 pt-3 pb-6"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.divider,
          }}
        >
          <TouchableOpacity
            onPress={handleContactAuthor}
            activeOpacity={0.8}
            className="items-center justify-center"
            style={{
              height: metrics.layout.controlHeight.xl,
              backgroundColor: colors.primary,
              borderRadius: metrics.borderRadius.sm,
            }}
          >
            <Text
              className="text-base font-semibold"
              style={{ color: colors.primaryForeground }}
            >
              Contact Author
            </Text>
          </TouchableOpacity>
        </View>
      </MotiView>
    </SafeAreaView>
  );
};
