import { useCreateDirectConversation } from "@/src/features/chat/hooks";
import { PostTypeIconBadge, ScoreBadge } from "@/src/features/post/components";
import { useGetPostById, useMatchingPost } from "@/src/features/post/hooks";
import type {
  BasePost,
  MatchEvidence,
  MatchStrength,
} from "@/src/features/post/types";
import { PostType } from "@/src/features/post/types";

import { useGetc2cHandoverPost } from "@/src/features/handover/hooks";
import {
  AppAccordion,
  AppImage,
  AppInlineError,
  AppSplashScreen,
} from "@/src/shared/components";
import { HANDOVER_ROUTE, SHARED_ROUTE } from "@/src/shared/constants";
import { colors, metrics } from "@/src/shared/theme";
import { formatCompareTimeGap } from "@/src/shared/utils/datetime.utils";
import { formatLocationGap } from "@/src/shared/utils/location.utils";
import { router } from "expo-router";
import { MotiView } from "moti";
import {
  CalendarIcon,
  ClockIcon,
  InfoIcon,
  MapPinIcon,
  NoteIcon,
  SparkleIcon,
  TextAaIcon,
} from "phosphor-react-native";
import React, { useMemo, useState } from "react";
import {
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ComparePostsScreenProps {
  postId: string;
  otherPostId: string;
}

type EvidenceRow = {
  key: string;
  title: string;
  note?: string;
  leftValue: string;
  rightValue: string;
  strength: MatchStrength;
};

type CompareCardProps = {
  post: BasePost;
  title: string;
};

const FALLBACK_VALUE = "—";

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

const formatEvidenceKey = (key: string): string => {
  const normalized = key
    .replaceAll(/[_-]/g, " ")
    .replaceAll(/([a-z])([A-Z])/g, "$1 $2")
    .trim();

  return normalized.replaceAll(/\b\w/g, (char) => char.toUpperCase());
};

const mapEvidenceRows = (evidence: MatchEvidence[]): EvidenceRow[] => {
  if (!evidence.length) {
    return [
      {
        key: "pending",
        title: "Evidence pending",
        note: "Matching signals are still being reviewed.",
        leftValue: FALLBACK_VALUE,
        rightValue: FALLBACK_VALUE,
        strength: "Partial",
      },
    ];
  }

  return evidence.map((item) => {
    const note = safeText(item.note);

    return {
      key: item.key,
      title: EVIDENCE_LABELS[item.key] ?? formatEvidenceKey(item.key),
      note: note === FALLBACK_VALUE ? undefined : note,
      leftValue: safeText(item.lostValue),
      rightValue: safeText(item.foundValue),
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

const ComparePostCard = ({ post }: CompareCardProps) => {
  const displayTitle = useMemo(() => {
    if (post.postTitle?.trim()) return post.postTitle;
    return "Untitled item";
  }, [post.postTitle]);

  const displayAddress = useMemo(() => {
    if (post.displayAddress?.trim()) return post.displayAddress;
    return "Unknown location";
  }, [post.displayAddress]);

  return (
    <View className="rounded-md border p-md2 gap-sm" style={cardStyle}>
      <View
        style={{
          borderRadius: metrics.borderRadius.sm,
          overflow: "hidden",
          borderColor: colors.divider,
          backgroundColor: colors.canvas,
          aspectRatio: 1,
        }}
      >
        <AppImage
          source={post.imageUrls?.[0] ? { uri: post.imageUrls[0] } : undefined}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
        <View className="absolute top-2 left-2">
          <PostTypeIconBadge status={post.postType} size="sm" />
        </View>
      </View>

      {/* Post Title */}
      <Text className="text-md text-textPrimary text-center">
        {displayTitle}
      </Text>

      {/* Informations */}
      <View className="flex-row items-center gap-xs">
        <MapPinIcon size={12} color={colors.primary} weight="fill" />
        <Text
          numberOfLines={1}
          className="text-xs leading-5 font-normal text-textMuted"
        >
          {displayAddress}
        </Text>
      </View>
    </View>
  );
};

export const ComparePostsScreen = ({
  postId,
  otherPostId,
}: ComparePostsScreenProps) => {
  const insets = useSafeAreaInsets();
  const [expandedEvidenceKeys, setExpandedEvidenceKeys] = useState<string[]>(
    [],
  );

  const { getC2CHandoverPost } = useGetc2cHandoverPost();

  const {
    similarPosts,
    isLoading: isLoadingMatch,
    error,
  } = useMatchingPost(postId);

  const isNotFoundError = (error: unknown) => {
    if (!(error instanceof Error)) return false;
    return /404|not found/i.test(error.message);
  };

  const { data: post1, isLoading: isLoadingPost1 } = useGetPostById({ postId });
  const { data: matchedPostDetail, isLoading: isLoadingMatchedPostDetail } =
    useGetPostById({ postId: otherPostId });

  const { isCreating } = useCreateDirectConversation();

  const matchedPost = useMemo(
    () => similarPosts.find((p) => p.id === otherPostId),
    [similarPosts, otherPostId],
  );

  const evidenceRows = useMemo(
    () => (matchedPost ? mapEvidenceRows(matchedPost.evidence ?? []) : []),
    [matchedPost],
  );

  const toggleEvidenceRow = (key: string) => {
    setExpandedEvidenceKeys((current) =>
      current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key],
    );
  };

  const isEvidenceExpanded = (key: string) =>
    expandedEvidenceKeys.includes(key);

  const formattedTimeGap = useMemo(
    () => formatCompareTimeGap(matchedPost?.timeGap),
    [matchedPost?.timeGap],
  );

  const formattedLocationGap = useMemo(
    () => formatLocationGap(matchedPost?.locationDistance),
    [matchedPost?.locationDistance],
  );

  const safeScore = useMemo(() => {
    if (matchedPost?.score == null) return 0;
    return Math.round(matchedPost.score * 100);
  }, [matchedPost]);

  const matchedAuthorId = matchedPostDetail?.author?.id;

  const isContactDisabled =
    !matchedAuthorId || isLoadingMatchedPostDetail || isCreating;

  const handleContactPress = async () => {
    if (isContactDisabled) return;
    if (!post1 || !matchedPostDetail) return;

    const isFoundPost = matchedPostDetail.postType === PostType.Found;
    const finderPostId = isFoundPost ? otherPostId : postId;
    const ownerPostId = isFoundPost ? postId : otherPostId;

    const req = {
      finderPostId,
      ownerPostId,
    };

    let existingHandoverId: string | null = null;

    try {
      const existingHandover = await getC2CHandoverPost(req);
      existingHandoverId = existingHandover.id;
    } catch (lookupError) {
      if (!isNotFoundError(lookupError)) throw lookupError;
    }

    if (existingHandoverId) {
      router.navigate(HANDOVER_ROUTE.detail(existingHandoverId));
      return;
    }

    router.push(SHARED_ROUTE.handoverRequest(postId, otherPostId));
  };

  if (isLoadingMatch || isLoadingPost1) return <AppSplashScreen />;

  if (error || !matchedPost || !post1) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.surface }}>
        <AppInlineError message="Could not load comparison details." />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-4 pb-8 gap-md">
          {/* Matching Rate */}
          <View className="flex-row justify-between">
            <Text
              className="mb-sm text-lg font-normal"
              style={{ color: colors.text.primary }}
            >
              Matching Rate
            </Text>
            <ScoreBadge value={safeScore} />
          </View>

          {/* Post Information */}
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
                <ComparePostCard post={post1 as BasePost} title="Your post" />
              </View>

              <View style={{ flex: 1 }}>
                <ComparePostCard
                  post={matchedPost as BasePost}
                  title="Their post"
                />
              </View>
            </View>
          </MotiView>

          {/* Evidences */}
          <MotiView
            from={{ opacity: 0, translateY: 16 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 260, delay: 120 }}
          >
            <Text
              className="mb-sm text-lg font-normal"
              style={{ color: colors.text.primary }}
            >
              Matching Evidences
            </Text>

            <View className="overflow-hidden gap-md2">
              {evidenceRows.map((evidence, index) => (
                <View key={`${evidence.key}-${index}`} style={cardStyle}>
                  <AppAccordion
                    isExpanded={isEvidenceExpanded(evidence.key)}
                    onToggle={() => toggleEvidenceRow(evidence.key)}
                    collapsedContent={
                      <View className="flex-row items-center p-md2 ">
                        <Text className="flex-1 text-sm font-normal text-textPrimary">
                          {evidence.title}
                        </Text>

                        <Text
                          className="text-xs font-semibold"
                          style={{ color: getStrengthColor(evidence.strength) }}
                        >
                          {evidence.strength}
                        </Text>
                      </View>
                    }
                    expandedContent={
                      <View className="">
                        <View className="overflow-hidden p-md2 gap-sm">
                          <View className="flex-row gap-sm">
                            <Text className="flex-1 text-sm font-normal text-textPrimary ">
                              Lost post
                            </Text>

                            <Text className="flex-1 text-sm font-normal text-textPrimary ">
                              Found post
                            </Text>
                          </View>

                          <View className="flex-row gap-sm">
                            <Text className="flex-1 text-sm font-thin text-textSecondary ">
                              {evidence.leftValue}
                            </Text>

                            <Text className="flex-1 text-sm font-thin text-textSecondary ">
                              {evidence.rightValue}
                            </Text>
                          </View>

                          {evidence.note ? (
                            <View className="flex-row items-center gap-xs mt-xs">
                              <NoteIcon size={20} weight="thin" />

                              <Text className="flex-1 text-xs font-thin text-textSecondary ">
                                {evidence.note}
                              </Text>
                            </View>
                          ) : null}
                        </View>
                      </View>
                    }
                  />
                </View>
              ))}
            </View>
          </MotiView>

          {/* Time & Location Gap */}
          <MotiView
            from={{ opacity: 0, translateY: 16 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 260, delay: 90 }}
          >
            <Text
              className="mb-sm text-lg font-normal"
              style={{ color: colors.text.primary }}
            >
              Match Proximity
            </Text>

            {/*  */}
            <View
              className="overflow-hidden rounded-md border px-sm"
              style={cardStyle}
            >
              {/* Time Difference */}
              <View className="flex-row items-center gap-sm py-sm">
                <ClockIcon size={20} weight="regular" />
                <Text className="flex-1 text-sm font-normal text-textPrimary">
                  Time Difference
                </Text>
                <Text className="text-xs text-textSecondary font-thin">
                  {formattedTimeGap}
                </Text>
              </View>

              <View className="h-px px-sm bg-divider" />

              {/* Location Gap */}
              <View className="flex-row items-center gap-sm py-sm">
                <MapPinIcon size={20} weight="regular" />
                <Text className="flex-1 text-sm font-normal text-textPrimary">
                  Distance
                </Text>
                <Text className="text-xs text-textSecondary font-thin">
                  {formattedLocationGap}
                </Text>
              </View>
            </View>
          </MotiView>

          {/* Match Calculation Breakdown */}
          <MotiView
            from={{ opacity: 0, translateY: 16 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 260, delay: 130 }}
          >
            <Text
              className="mb-sm text-lg font-normal"
              style={{ color: colors.text.primary }}
            >
              Match Confidence Factors
            </Text>

            <View
              className="overflow-hidden rounded-md border px-sm py-xs"
              style={cardStyle}
            >
              {/* Step 1: Location */}
              <View className="flex-row items-start gap-sm py-sm">
                <MapPinIcon
                  size={16}
                  weight="duotone"
                  color={colors.status.info}
                  style={{ marginTop: 2 }}
                />
                <View className="flex-1">
                  <Text className="text-sm font-normal text-textPrimary">
                    Location Proximity
                  </Text>
                  <Text className="text-xs font-thin text-textSecondary mt-xs">
                    Found within a 20 km radius of the reported area.
                  </Text>
                </View>
              </View>

              <View className="h-px w-full bg-divider" />

              {/* Step 2: Time */}
              <View className="flex-row items-start gap-sm py-sm">
                <CalendarIcon
                  size={16}
                  weight="duotone"
                  color={colors.accentForeground}
                  style={{ marginTop: 2 }}
                />
                <View className="flex-1">
                  <Text className="text-sm font-normal text-textPrimary">
                    Timeframe Alignment
                  </Text>
                  <Text className="text-xs font-thin text-textSecondary mt-xs">
                    Reported within a 10-day window of the event.
                  </Text>
                </View>
              </View>

              <View className="h-px w-full bg-divider" />

              {/* Step 3: Description */}
              <View className="flex-row items-start gap-sm py-sm">
                <TextAaIcon
                  size={16}
                  weight="duotone"
                  color={colors.primary}
                  style={{ marginTop: 2 }}
                />
                <View className="flex-1">
                  <Text className="text-sm font-normal text-textPrimary">
                    Description Similarity
                  </Text>
                  <Text className="text-xs font-thin text-textSecondary mt-xs">
                    Visual traits and item details closely align.
                  </Text>
                </View>
              </View>

              <View className="h-px w-full bg-divider" />

              {/* Step 4: AI */}
              <View className="flex-row items-start gap-sm py-sm">
                <SparkleIcon
                  size={16}
                  weight="duotone"
                  color={colors.status.success}
                  style={{ marginTop: 2 }}
                />
                <View className="flex-1">
                  <Text className="text-sm font-normal text-textPrimary">
                    Smart AI Verification
                  </Text>
                  <Text className="text-xs font-thin text-textSecondary mt-xs">
                    Our AI system analyzed the data to confirm a high-confidence
                    match.
                  </Text>
                </View>
              </View>
            </View>
          </MotiView>

          {/* Tooltip */}
          <MotiView
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
                className="flex-1 text-xs leading-relaxed"
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
            onPress={handleContactPress}
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
        </View>
      </MotiView>
    </View>
  );
};
