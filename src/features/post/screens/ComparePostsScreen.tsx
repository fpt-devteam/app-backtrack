import { useCreateDirectConversation } from "@/src/features/chat/hooks";
import { PostTypeIconBadge } from "@/src/features/post/components";
import { useGetPostById, useMatchingPost } from "@/src/features/post/hooks";
import type {
  MatchEvidence,
  MatchStrength,
  PostCategory,
  SimilarPost,
} from "@/src/features/post/types";
import { POST_CATEGORIES, PostType } from "@/src/features/post/types";

import {
  AppHeader,
  AppImage,
  AppInlineError,
  AppSplashScreen,
  CloseButton,
  HeaderTitle,
} from "@/src/shared/components";
import { toast } from "@/src/shared/components/ui/toast";
import { CHAT_ROUTE } from "@/src/shared/constants";
import { colors, metrics } from "@/src/shared/theme";
import { router } from "expo-router";
import { MotiView } from "moti";
import {
  CheckCircleIcon,
  CircleIcon,
  InfoIcon,
  WarningCircleIcon,
  XCircleIcon,
} from "phosphor-react-native";
import React, { useMemo } from "react";
import {
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

interface ComparePostsScreenProps {
  postId: string;
  otherPostId: string;
}

type CompareIdentityRow = {
  label: string;
  leftValue: string;
  rightValue: string;
};

type DateInput = Date | string | null | undefined;

type ComparePostLike = {
  postType: PostType;
  postTitle?: string | null;
  category?: string;
  imageUrls?: string[];
  displayAddress?: string | null;
  eventTime?: DateInput;
  item?: {
    itemName?: string;
    category?: string;
  };
  cardDetail?: SimilarPost["cardDetail"];
  personalBelongingDetail?: SimilarPost["personalBelongingDetail"];
  electronicDetail?: SimilarPost["electronicDetail"];
  otherDetail?: SimilarPost["otherDetail"];
};

type EvidenceRow = {
  key: string;
  title: string;
  detail: string;
  strength: MatchStrength;
};

type CompareCardProps = {
  post: ComparePostLike;
  title: string;
  rows: { label: string; value: string }[];
};

const FALLBACK_VALUE = "—";

const CATEGORY_LABELS: Record<PostCategory, string> = {
  [POST_CATEGORIES.ELECTRONICS]: "Electronics",
  [POST_CATEGORIES.CARD]: "Cards",
  [POST_CATEGORIES.PERSONAL_BELONGINGS]: "Personal belongings",
  [POST_CATEGORIES.OTHER]: "Other",
};

const EVIDENCE_LABELS: Record<string, string> = {
  card_number: "Card number matches exactly",
  holder_name: "Holder name matches",
  date_of_birth: "Date of birth matches",
  issue_date: "Issue date is consistent",
  issuing_authority: "Issuing authority aligns",
  location: "Location nearby",
  time_window: "Time window plausible",
};

const cardStyle = {
  backgroundColor: colors.surface,
  borderRadius: metrics.borderRadius.md,
  overflow: "hidden" as const,
  borderWidth: 1,
  borderColor: colors.divider,
  ...(Platform.OS === "ios"
    ? metrics.shadows.level1.ios
    : metrics.shadows.level1.android),
};

const safeText = (value: unknown): string => {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return FALLBACK_VALUE;
};

const toDate = (input: DateInput): Date | null => {
  if (!input) return null;
  const d = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(d.getTime())) return null;
  return d;
};

const formatDayLabel = (input: DateInput): string => {
  const date = toDate(input);
  if (!date) return "Unknown";

  return `${date.toLocaleString("en-US", { month: "short" })} ${date.getDate()}`;
};

const formatCompactDate = (input: DateInput): string => {
  const date = toDate(input);
  if (!date) return FALLBACK_VALUE;

  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

const formatIssueDate = (input: DateInput): string => {
  const date = toDate(input);
  if (!date) return FALLBACK_VALUE;

  return `${date.toLocaleString("en-US", { month: "short" })} ${date.getFullYear()}`;
};

const formatEvidenceKey = (key: string): string => {
  const normalized = key
    .replaceAll(/[_-]/g, " ")
    .replaceAll(/([a-z])([A-Z])/g, "$1 $2")
    .trim();

  return normalized.replaceAll(/\b\w/g, (char) => char.toUpperCase());
};

const getCategoryLabel = (category?: string): string => {
  if (!category) return "Unknown category";

  if (category in CATEGORY_LABELS) {
    return CATEGORY_LABELS[category as PostCategory];
  }

  return formatEvidenceKey(category);
};

const getPostTitle = (post: ComparePostLike): string => {
  const candidates = [
    post.cardDetail?.itemName,
    post.personalBelongingDetail?.itemName,
    post.electronicDetail?.itemName,
    post.otherDetail?.itemIdentifier,
    post.item?.itemName,
    post.postTitle,
  ];

  for (const candidate of candidates) {
    const text = safeText(candidate);
    if (text !== FALLBACK_VALUE) return text;
  }

  return "Unknown item";
};

const hasCardIdentity = (post: ComparePostLike): boolean => {
  const card = post.cardDetail;
  if (!card) return false;

  return [
    card.holderName,
    card.cardNumberMasked,
    card.dateOfBirth,
    card.issueDate,
  ].some((value) => safeText(value) !== FALLBACK_VALUE);
};

const buildIdentityRows = (
  leftPost: ComparePostLike,
  rightPost: ComparePostLike,
): CompareIdentityRow[] => {
  const shouldUseCardRows =
    hasCardIdentity(leftPost) || hasCardIdentity(rightPost);

  if (shouldUseCardRows) {
    return [
      {
        label: "Holder",
        leftValue: safeText(leftPost.cardDetail?.holderName),
        rightValue: safeText(rightPost.cardDetail?.holderName),
      },
      {
        label: "DOB",
        leftValue: formatCompactDate(leftPost.cardDetail?.dateOfBirth),
        rightValue: formatCompactDate(rightPost.cardDetail?.dateOfBirth),
      },
      {
        label: "Card no.",
        leftValue: safeText(leftPost.cardDetail?.cardNumberMasked),
        rightValue: safeText(rightPost.cardDetail?.cardNumberMasked),
      },
      {
        label: "Issued",
        leftValue: formatIssueDate(leftPost.cardDetail?.issueDate),
        rightValue: formatIssueDate(rightPost.cardDetail?.issueDate),
      },
    ];
  }

  return [
    {
      label: "Name",
      leftValue: getPostTitle(leftPost),
      rightValue: getPostTitle(rightPost),
    },
    {
      label: "Category",
      leftValue: getCategoryLabel(leftPost.category ?? leftPost.item?.category),
      rightValue: getCategoryLabel(
        rightPost.category ?? rightPost.item?.category,
      ),
    },
    {
      label: "Event",
      leftValue: formatDayLabel(leftPost.eventTime),
      rightValue: formatDayLabel(rightPost.eventTime),
    },
    {
      label: "Address",
      leftValue: safeText(leftPost.displayAddress),
      rightValue: safeText(rightPost.displayAddress),
    },
  ];
};

const getTimeGapLabel = (leftDate: DateInput, rightDate: DateInput): string => {
  const left = toDate(leftDate);
  const right = toDate(rightDate);

  if (!left || !right) return "";

  const diffInHours = Math.round(
    Math.abs(left.getTime() - right.getTime()) / (1000 * 60 * 60),
  );

  if (diffInHours <= 1) return "Happened around the same time";

  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} apart`;
  }

  const diffInDays = Math.round(diffInHours / 24);
  return `${diffInDays} day${diffInDays > 1 ? "s" : ""} apart`;
};

const mapEvidenceRows = (evidence: MatchEvidence[]): EvidenceRow[] => {
  if (!evidence.length) {
    return [
      {
        key: "pending",
        title: "Evidence pending",
        detail: "Matching signals are still being reviewed.",
        strength: "Partial",
      },
    ];
  }

  return evidence.map((item) => {
    const note = safeText(item.note);
    const displayValue = safeText(item.displayValue);
    let detail = "No extra details provided.";

    if (note === FALLBACK_VALUE) {
      if (displayValue !== FALLBACK_VALUE) {
        detail = displayValue;
      }
    } else {
      detail = note;
    }

    return {
      key: item.key,
      title: EVIDENCE_LABELS[item.key] ?? formatEvidenceKey(item.key),
      detail,
      strength: item.strength,
    };
  });
};

const getStrengthColor = (strength: MatchStrength): string => {
  if (strength === "Strong") return colors.babu[500];
  if (strength === "Partial") return colors.kazan[500];
  if (strength === "Mismatch") return colors.error[500];
  return colors.hof[500];
};

const renderStrengthIcon = (strength: MatchStrength) => {
  if (strength === "Strong") {
    return <CheckCircleIcon size={18} color={colors.babu[500]} weight="fill" />;
  }

  if (strength === "Partial") {
    return (
      <WarningCircleIcon size={18} color={colors.kazan[500]} weight="fill" />
    );
  }

  if (strength === "Mismatch") {
    return <XCircleIcon size={18} color={colors.error[500]} weight="fill" />;
  }

  return <CircleIcon size={18} color={colors.hof[500]} weight="fill" />;
};

const ComparePostCard = ({ post, rows }: CompareCardProps) => {
  return (
    <View className="rounded-md border p-2.5" style={cardStyle}>
      <View
        style={{
          borderRadius: metrics.borderRadius.sm,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: colors.divider,
          backgroundColor: colors.canvas,
          aspectRatio: 1,
        }}
      >
        <AppImage
          source={post.imageUrls?.[0] ? { uri: post.imageUrls[0] } : undefined}
          className="w-full h-full"
          resizeMode="cover"
        />
        <View className="absolute top-2 left-2">
          <PostTypeIconBadge status={post.postType} size="sm" />
        </View>
      </View>

      <View className="mt-3 gap-1.5">
        {rows.map((row) => (
          <View key={row.label} className="flex-row items-start gap-2">
            <Text className="text-sm" style={{ color: colors.text.secondary }}>
              {row.label}
            </Text>
            <Text
              className="flex-1 text-right text-sm font-semibold"
              style={{ color: colors.text.primary }}
              numberOfLines={1}
            >
              {row.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export const ComparePostsScreen = ({
  postId,
  otherPostId,
}: ComparePostsScreenProps) => {
  const insets = useSafeAreaInsets();

  const {
    similarPosts,
    isLoading: isLoadingMatch,
    error,
  } = useMatchingPost(postId);

  const { data: post1, isLoading: isLoadingPost1 } = useGetPostById({ postId });
  const { data: matchedPostDetail, isLoading: isLoadingMatchedPostDetail } =
    useGetPostById({ postId: otherPostId });

  const { create, isCreating } = useCreateDirectConversation();

  const matchedPost = useMemo(
    () => similarPosts.find((p) => p.id === otherPostId),
    [similarPosts, otherPostId],
  );

  const identityRows = useMemo(
    () =>
      post1 && matchedPost
        ? buildIdentityRows(
            post1 as ComparePostLike,
            matchedPost as ComparePostLike,
          )
        : [],
    [post1, matchedPost],
  );

  const evidenceRows = useMemo(
    () => (matchedPost ? mapEvidenceRows(matchedPost.evidence ?? []) : []),
    [matchedPost],
  );

  const leftRows = useMemo(
    () =>
      identityRows.map((row) => ({ label: row.label, value: row.leftValue })),
    [identityRows],
  );

  const rightRows = useMemo(
    () =>
      identityRows.map((row) => ({ label: row.label, value: row.rightValue })),
    [identityRows],
  );

  const scorePercent = useMemo(
    () => (matchedPost ? Math.round((matchedPost.score ?? 0) * 100) : 0),
    [matchedPost],
  );

  const matchMetaLabel = useMemo(() => {
    const category = matchedPost?.category ?? post1?.category;
    return getCategoryLabel(category);
  }, [matchedPost, post1]);

  const timeGapLabel = useMemo(
    () =>
      post1 && matchedPost
        ? getTimeGapLabel(post1.eventTime, matchedPost.eventTime)
        : "",
    [post1, matchedPost],
  );

  const matchedAuthorId = matchedPostDetail?.author?.id;
  const isContactDisabled =
    !matchedAuthorId || isLoadingMatchedPostDetail || isCreating;

  const handleContactAuthor = async () => {
    if (!matchedAuthorId) {
      toast.error("Unable to contact this author right now.");
      return;
    }

    try {
      const req = { memberId: matchedAuthorId };
      const res = await create(req);
      if (!res.data?.conversation?.conversationId) {
        toast.error("Unable to start conversation. Please try again.");
        return;
      }
      router.push(CHAT_ROUTE.message(res.data?.conversation?.conversationId));
    } catch {
      toast.error("Failed to start chat. Please try again.");
    }
  };

  if (isLoadingMatch || isLoadingPost1) return <AppSplashScreen />;

  if (error || !matchedPost || !post1) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.surface }}>
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
      style={{ flex: 1, backgroundColor: colors.surface }}
      edges={["top", "left", "right"]}
    >
      <AppHeader
        right={<CloseButton />}
        center={<HeaderTitle title="Compare Items" className="items-center" />}
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-4 pb-8">
          <View className="mb-4 flex-row items-start justify-between gap-3">
            <View
              className="flex-row items-center rounded-full px-2.5 py-1"
              style={{
                backgroundColor: colors.babu[100],
                borderWidth: 1,
                borderColor: colors.babu[200],
              }}
            >
              <View
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 99,
                  backgroundColor: colors.babu[500],
                  marginRight: 6,
                }}
              />
              <Text
                className="text-xs font-semibold"
                style={{ color: colors.babu[600] }}
              >
                {scorePercent}% match
              </Text>
            </View>
          </View>

          <MotiView
            from={{ opacity: 0, translateY: 20, scale: 0.98 }}
            animate={{ opacity: 1, translateY: 0, scale: 1 }}
            transition={{ type: "spring", damping: 18, stiffness: 150 }}
          >
            <View
              className="relative flex-row"
              style={{ gap: metrics.spacing.sm }}
            >
              <View style={{ flex: 1 }}>
                <ComparePostCard
                  post={post1 as ComparePostLike}
                  title="Your post"
                  rows={leftRows}
                />
              </View>

              <View style={{ flex: 1 }}>
                <ComparePostCard
                  post={matchedPost as ComparePostLike}
                  title="Their post"
                  rows={rightRows}
                />
              </View>
            </View>
          </MotiView>

          <MotiView
            className="mt-6"
            from={{ opacity: 0, translateY: 16 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 260, delay: 120 }}
          >
            <Text
              className="mb-3 text-base font-semibold"
              style={{ color: colors.text.primary }}
            >
              Evidence breakdown
            </Text>

            <View
              className="overflow-hidden rounded-md border"
              style={cardStyle}
            >
              {evidenceRows.map((evidence, index) => (
                <View key={`${evidence.key}-${index}`}>
                  <View className="flex-row items-start gap-2 px-3 py-3">
                    <View style={{ marginTop: 1 }}>
                      {renderStrengthIcon(evidence.strength)}
                    </View>

                    <View className="flex-1">
                      <Text
                        className="text-sm font-semibold"
                        style={{ color: colors.text.primary }}
                      >
                        {evidence.title}
                      </Text>
                      <Text
                        className="mt-0.5 text-xs"
                        style={{ color: colors.text.secondary }}
                      >
                        {evidence.detail}
                      </Text>
                    </View>

                    <Text
                      className="text-sm font-semibold"
                      style={{ color: getStrengthColor(evidence.strength) }}
                    >
                      {evidence.strength}
                    </Text>
                  </View>

                  {index < evidenceRows.length - 1 && (
                    <View
                      className="h-px"
                      style={{
                        backgroundColor: colors.divider,
                        marginHorizontal: 12,
                      }}
                    />
                  )}
                </View>
              ))}
            </View>
          </MotiView>

          <MotiView
            className="mt-4"
            from={{ opacity: 0, translateY: 16 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 260, delay: 180 }}
          >
            <View
              className="flex-row items-start rounded-md border px-3 py-3"
              style={{
                borderColor: colors.info[300],
                backgroundColor: colors.info[50],
              }}
            >
              <InfoIcon
                size={16}
                weight="fill"
                color={colors.info[600]}
                style={{ marginTop: 1, marginRight: 8 }}
              />
              <Text
                className="flex-1 text-xs"
                style={{ color: colors.info[600] }}
              >
                Full card number and contact details are hidden until both
                parties confirm this match. This protects everyone involved.
              </Text>
            </View>
          </MotiView>
        </View>
      </ScrollView>

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
            paddingBottom: Math.max(insets.bottom, metrics.spacing.md),
          }}
        >
          <TouchableOpacity
            onPress={handleContactAuthor}
            disabled={isContactDisabled}
            activeOpacity={0.8}
            className="items-center justify-center"
            style={{
              height: metrics.layout.controlHeight.xl,
              backgroundColor: isContactDisabled
                ? colors.hof[300]
                : colors.primary,
              borderRadius: metrics.borderRadius.sm,
            }}
          >
            <Text
              className="text-base font-semibold"
              style={{ color: colors.primaryForeground }}
            >
              {isCreating ? "Connecting..." : "Contact Author"}
            </Text>
          </TouchableOpacity>

          {!matchedAuthorId && !isLoadingMatchedPostDetail && (
            <Text
              className="mt-2 text-center text-xs"
              style={{ color: colors.text.muted }}
            >
              Author info is unavailable for this match.
            </Text>
          )}
        </View>
      </MotiView>
    </SafeAreaView>
  );
};
