import { useCreateDirectConversation } from "@/src/features/chat/hooks";
import { PostStatusBadge } from "@/src/features/post/components";
import { useGetPostById, useMatchingPost } from "@/src/features/post/hooks";
import type { Post } from "@/src/features/post/types";
import {
  PostType,
  SimilarPost,
  SimilarPostCriterionPoint,
} from "@/src/features/post/types";

import {
  AppAccordion,
  AppHeader,
  AppInlineError,
  AppSplashScreen,
  CloseButton,
  HeaderTitle,
} from "@/src/shared/components";
import { CHAT_ROUTE } from "@/src/shared/constants";
import { colors } from "@/src/shared/theme";
import { formatDateTime } from "@/src/shared/utils";
import { router } from "expo-router";
import { MotiView } from "moti";
import {
  CaretDownIcon,
  ClockIcon,
  EyeIcon,
  MapPinIcon,
  NoteIcon,
  SparkleIcon,
  TagIcon,
} from "phosphor-react-native";
import React, { useMemo, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
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

const fmtScore = (score: number) => `${parseFloat((score * 100).toFixed(2))}%`;

const ComparisonRowItem = ({
  attribute,
  post1Value,
  post2Value,
}: ComparisonRow) => (
  <View className="flex-row items-start py-2.5 px-3">
    <View style={{ flex: 3 }}>
      <Text className="text-xs font-bold" style={{ color: colors.slate[700] }}>
        {attribute}
      </Text>
    </View>
    <View style={{ flex: 3.5 }} className="items-start px-1">
      <Text className="text-xs" style={{ color: colors.slate[600] }}>
        {post1Value}
      </Text>
    </View>
    <View style={{ flex: 3.5 }} className="items-start px-1">
      <Text className="text-xs" style={{ color: colors.slate[600] }}>
        {post2Value}
      </Text>
    </View>
  </View>
);

const CategoryAppAccordion = ({ title, icon, rows }: Omit<Category, "id">) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View
      className="mb-3 rounded-sm overflow-hidden"
      style={{ backgroundColor: colors.white }}
    >
      <AppAccordion
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded((prev) => !prev)}
        collapsedContent={
          <View className="flex-row items-center px-4 py-3.5 gap-3">
            {icon}
            <Text
              className="font-bold text-base flex-1"
              style={{ color: colors.slate[900] }}
            >
              {title}
            </Text>
            <MotiView
              animate={{ rotate: isExpanded ? "180deg" : "0deg" }}
              transition={{ type: "timing", duration: 250 }}
            >
              <CaretDownIcon size={16} color={colors.slate[400]} />
            </MotiView>
          </View>
        }
        expandedContent={
          <View className="px-4 pb-4">
            <View
              className="rounded-xl overflow-hidden"
              style={{ backgroundColor: colors.slate[50] }}
            >
              {rows.map((row, index) => (
                <React.Fragment key={row.attribute}>
                  <ComparisonRowItem {...row} />
                  {index < rows.length - 1 && (
                    <View
                      className="mx-3 h-px"
                      style={{ backgroundColor: colors.slate[200] }}
                    />
                  )}
                </React.Fragment>
              ))}
            </View>
          </View>
        }
      />
    </View>
  );
};

const HeroImage = ({
  imageUrl,
  postType,
}: {
  imageUrl?: string;
  postType: PostType;
}) => {
  return (
    <View className="flex-1 rounded-sm overflow-hidden aspect-square">
      <Image
        source={{ uri: imageUrl }}
        className="w-full h-full"
        resizeMode="cover"
      />
      <View className="absolute top-2 left-2">
        <PostStatusBadge status={postType} size="sm" />
      </View>
    </View>
  );
};

// ─── buildCategories ─────────────────────────────────────────────────────────

const buildCategories = (post1: Post, post2: SimilarPost): Category[] => {
  return [
    {
      id: "general",
      title: "General Info",
      icon: <TagIcon size={20} color={colors.sky[500]} weight="fill" />,
      rows: [
        {
          attribute: "Name",
          post1Value: post1.itemName,
          post2Value: post2.itemName,
        },
        {
          attribute: "Type",
          post1Value: post1.postType,
          post2Value: post2.postType,
        },
        {
          attribute: "Description",
          post1Value: post1.description ?? "—",
          post2Value: post2.description || "—",
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
      ],
    },
  ];
};

// ─── AI Criteria ─────────────────────────────────────────────────────────────

type CriterionCategory = {
  id: string;
  title: string;
  icon: React.ReactNode;
  score: number;
  points: SimilarPostCriterionPoint[];
};

const getScoreColor = (score: number) => {
  if (score >= 0.7) return colors.emerald[600];
  if (score >= 0.4) return colors.amber[500];
  return colors.red[400];
};

const CriterionPointRow = ({
  label,
  detail,
}: {
  label: string;
  detail: string;
}) => (
  <View className="flex-row items-start py-2.5 px-3">
    <View style={{ flex: 2 }}>
      <Text
        className="text-xs font-semibold"
        style={{ color: colors.slate[700] }}
        numberOfLines={3}
      >
        {label}
      </Text>
    </View>
    <View style={{ flex: 3 }}>
      <Text className="text-xs leading-4" style={{ color: colors.slate[600] }}>
        {detail}
      </Text>
    </View>
  </View>
);

const CriteriaAppAccordion = ({
  title,
  icon,
  score,
  points,
}: Omit<CriterionCategory, "id">) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const scoreColor = getScoreColor(score);

  return (
    <View
      className="mb-3 rounded-sm overflow-hidden"
      style={{ backgroundColor: colors.white }}
    >
      <AppAccordion
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded((prev) => !prev)}
        collapsedContent={
          <View className="flex-row items-center px-4 py-3.5 gap-3">
            {icon}
            <Text
              className="font-bold text-base flex-1"
              style={{ color: colors.slate[900] }}
            >
              {title}
            </Text>
            <Text className="text-xs font-bold" style={{ color: scoreColor }}>
              {score}%
            </Text>
            <MotiView
              animate={{ rotate: isExpanded ? "180deg" : "0deg" }}
              transition={{ type: "timing", duration: 250 }}
            >
              <CaretDownIcon size={16} color={colors.slate[400]} />
            </MotiView>
          </View>
        }
        expandedContent={
          points.length > 0 ? (
            <View className="px-4 pb-4">
              <View
                className="rounded-xl overflow-hidden"
                style={{ backgroundColor: colors.slate[50] }}
              >
                {points.map((point, index) => (
                  <React.Fragment key={index}>
                    <CriterionPointRow
                      label={point.label}
                      detail={point.detail}
                    />
                    {index < points.length - 1 && (
                      <View
                        className="mx-3 h-px"
                        style={{ backgroundColor: colors.slate[200] }}
                      />
                    )}
                  </React.Fragment>
                ))}
              </View>
            </View>
          ) : null
        }
      />
    </View>
  );
};

const buildCriteriaCategories = (
  criteria: NonNullable<SimilarPost["criteria"]>,
): CriterionCategory[] => [
  {
    id: "visual",
    title: "Visual Analysis",
    icon: <EyeIcon size={20} color={colors.blue[500]} weight="fill" />,
    score: criteria.visualAnalysis.score,
    points: criteria.visualAnalysis.points ?? [],
  },
  {
    id: "description",
    title: "Description Match",
    icon: <NoteIcon size={20} color={colors.sky[500]} weight="fill" />,
    score: criteria.description.score,
    points: criteria.description.points ?? [],
  },
  {
    id: "location",
    title: "Location Match",
    icon: <MapPinIcon size={20} color={colors.emerald[600]} weight="fill" />,
    score: criteria.location.score,
    points: criteria.location.points ?? [],
  },
  {
    id: "timeWindow",
    title: "Time Window",
    icon: <ClockIcon size={20} color={colors.amber[500]} weight="fill" />,
    score: criteria.timeWindow.score,
    points: criteria.timeWindow.points ?? [],
  },
];

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

  const criteriaCategories = useMemo(
    () =>
      matchedPost?.criteria
        ? buildCriteriaCategories(matchedPost.criteria)
        : [],
    [matchedPost],
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
      <View className="flex-1 bg-background-light">
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
      className="flex-1 bg-background-light"
      edges={["top", "left", "right"]}
    >
      <AppHeader
        left={<CloseButton />}
        center={<HeaderTitle title="Compare Items" className="items-center" />}
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-4 pb-8">
          {/* ── Hero: Images + VS badge ── */}
          <View className="relative mb-2">
            <View className="flex-row gap-2">
              <HeroImage
                imageUrl={post1.images[0]?.url}
                postType={post1.postType}
              />
              <HeroImage
                imageUrl={matchedPost.images[0]?.url}
                postType={matchedPost.postType}
              />
            </View>
          </View>

          {/* ── Assessment Summary ── */}
          {matchedPost.assessmentSummary && (
            <View
              className="mb-3 rounded-sm overflow-hidden"
              style={{ backgroundColor: colors.white }}
            >
              {/* Header bar */}
              <View
                className="flex-row items-center px-4 py-3 gap-2.5"
                style={{ backgroundColor: colors.sky[50] }}
              >
                <View
                  className="w-8 h-8 rounded-full items-center justify-center"
                  style={{ backgroundColor: colors.sky[100] }}
                >
                  <SparkleIcon
                    size={16}
                    color={colors.sky[500]}
                    weight="fill"
                  />
                </View>
                <Text
                  className="font-bold text-sm flex-1"
                  style={{ color: colors.sky[600] }}
                >
                  AI Assessment
                </Text>
                <View
                  className="px-2.5 py-1 rounded-full"
                  style={{
                    backgroundColor:
                      getScoreColor(matchedPost.matchScore) + "20",
                  }}
                >
                  <Text
                    className="text-xs font-bold"
                    style={{ color: getScoreColor(matchedPost.matchScore) }}
                  >
                    {fmtScore(matchedPost.matchScore)} match
                  </Text>
                </View>
              </View>

              {/* Body */}
              <View
                className="px-4 py-3.5 border-t"
                style={{ borderColor: colors.sky[100] }}
              >
                <Text
                  className="text-sm leading-6"
                  style={{ color: colors.slate[700] }}
                >
                  {matchedPost.assessmentSummary}
                </Text>
              </View>
            </View>
          )}

          {/* ── AppAccordion Categories ── */}
          {categories.map((category) => (
            <CategoryAppAccordion key={category.id} {...category} />
          ))}

          {/* ── AI Analysis ── */}
          {criteriaCategories.length > 0 && (
            <>
              {criteriaCategories.map((item) => (
                <CriteriaAppAccordion key={item.id} {...item} />
              ))}
            </>
          )}
        </View>
      </ScrollView>

      {/* ── Bottom Action Bar ── */}
      {/* <View
        className="border-t px-4 pt-3 pb-6"
        style={{
          backgroundColor: colors.white,
          borderColor: colors.slate[100],
        }}
      >
        <TouchableOpacity
          onPress={handleContactAuthor}
          activeOpacity={0.7}
          className="h-12 items-center justify-center rounded-lg"
          style={{ backgroundColor: colors.primary }}
        >
          <Text
            className="text-base font-semibold"
            style={{ color: colors.white }}
          >
            Contact Author
          </Text>
        </TouchableOpacity>
      </View> */}
    </SafeAreaView>
  );
};
