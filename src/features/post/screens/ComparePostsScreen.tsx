import {
  MatchedAttributesSection,
  PostComparisonCard,
} from "@/src/features/post/components";
import { useCreateDirectConversation } from "@/src/features/chat/hooks";
import { useMatchingPost } from "@/src/features/post/hooks";
import {
  AppHeader,
  AppInlineError,
  AppSplashScreen,
  CloseButton,
  FormSubmitButton,
  HeaderTitle,
} from "@/src/shared/components";
import { CHAT_ROUTE } from "@/src/shared/constants";
import { colors } from "@/src/shared/theme";
import { formatDistance } from "@/src/shared/utils";
import { router } from "expo-router";
import {
  BrainIcon,
  CheckCircleIcon,
  MapPinIcon,
  ShieldCheckIcon,
  SparkleIcon,
  WarningIcon,
} from "phosphor-react-native";
import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

interface ComparePostsScreenProps {
  postId: string;
  otherPostId: string;
}

type MatchLevel = "VeryHigh" | "High" | "Medium" | "Low";

const LEVEL_CONFIG: Record<
  MatchLevel,
  { color: string; bg: string; icon: React.ReactNode; label: string; ringColor: string }
> = {
  VeryHigh: {
    color: colors.emerald[600],
    bg: "#ecfdf5",
    ringColor: colors.emerald[600],
    icon: <ShieldCheckIcon size={16} color={colors.emerald[600]} weight="fill" />,
    label: "Very High Match",
  },
  High: {
    color: "#10b981",
    bg: "#ecfdf5",
    ringColor: "#10b981",
    icon: <CheckCircleIcon size={16} color="#10b981" weight="fill" />,
    label: "High Match",
  },
  Medium: {
    color: colors.amber[500],
    bg: "#fffbeb",
    ringColor: colors.amber[500],
    icon: <SparkleIcon size={16} color={colors.amber[500]} weight="fill" />,
    label: "Medium Match",
  },
  Low: {
    color: colors.slate[400],
    bg: colors.slate[50],
    ringColor: colors.slate[300],
    icon: <WarningIcon size={16} color={colors.slate[400]} weight="fill" />,
    label: "Low Match",
  },
};

export const ComparePostsScreen = ({
  postId,
  otherPostId,
}: ComparePostsScreenProps) => {
  const { similarPosts, isLoading, error } = useMatchingPost(postId);
  const { create: createConversation, isCreating } = useCreateDirectConversation();

  const matchedPost = useMemo(
    () => similarPosts.find((p) => p.id === otherPostId),
    [similarPosts, otherPostId],
  );

  const handleContactAuthor = async () => {
    Toast.show({
      type: "info",
      text1: "Coming soon",
      text2: "Contact author is not available yet.",
    });
  };

  if (isLoading) return <AppSplashScreen />;

  if (error || !matchedPost) {
    return (
      <View className="flex-1 bg-background-light">
        <AppHeader
          left={<CloseButton />}
          center={<HeaderTitle title="Compare Items" className="items-center" />}
        />
        <AppInlineError message="Could not load comparison details." />
      </View>
    );
  }

  const matchScore = matchedPost.matchScore;
  const matchLevel = (matchedPost.matchingLevel ?? "Low") as MatchLevel;
  const levelConfig = LEVEL_CONFIG[matchLevel] ?? LEVEL_CONFIG.Low;
  const scorePercent = parseFloat((matchScore * 100).toFixed(2));

  return (
    <SafeAreaView className="flex-1 bg-background-light" edges={["top", "left", "right"]}>
      <AppHeader
        left={<CloseButton />}
        center={<HeaderTitle title="Compare Items" className="items-center" />}
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-4 pb-8">

          {/* ── Match Score Card ── */}
          <View className="bg-white rounded-3xl p-6 mb-4 items-center border border-slate-100">
            <View
              style={[
                styles.scoreRing,
                { borderColor: levelConfig.ringColor, shadowColor: levelConfig.ringColor },
              ]}
            >
              <Text style={[styles.scoreNumber, { color: colors.slate[900] }]}>
                {scorePercent}%
              </Text>
              <Text style={styles.scoreLabel}>MATCH</Text>
            </View>

            <View
              className="mt-4 flex-row items-center px-4 py-2 rounded-full gap-1.5"
              style={{ backgroundColor: levelConfig.bg }}
            >
              {levelConfig.icon}
              <Text className="font-bold text-sm" style={{ color: levelConfig.color }}>
                {levelConfig.label}
              </Text>
            </View>

            <View className="mt-3 flex-row items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-full">
              <MapPinIcon size={12} color={colors.slate[400]} />
              <Text className="text-slate-500 text-xs">
                {formatDistance(matchedPost.distanceMeters)} apart
              </Text>
            </View>

            {matchedPost.isAssessed && (
              <View className="mt-2 flex-row items-center gap-1 bg-blue-50 px-3 py-1 rounded-full">
                <BrainIcon size={11} color={colors.blue[500]} weight="fill" />
                <Text className="text-blue-600 text-[11px] font-medium">AI Assessed</Text>
              </View>
            )}

            <Text className="mt-3 text-slate-400 text-xs text-center px-6 leading-4">
              Based on visual similarity, location proximity, and timing.
            </Text>
          </View>

          {/* ── AI Assessment Summary ── */}
          {matchedPost.assessmentSummary && (
            <View className="bg-blue-50 rounded-2xl p-4 mb-4 border border-blue-100/80">
              <View className="flex-row items-center gap-2 mb-2">
                <BrainIcon size={18} color={colors.blue[500]} weight="fill" />
                <Text className="font-bold text-blue-900 text-sm">AI Assessment</Text>
              </View>
              <Text className="text-slate-600 text-sm leading-5 italic">
                "{matchedPost.assessmentSummary}"
              </Text>
            </View>
          )}

          {/* ── Matched Post Card ── */}
          <Text className="text-slate-900 font-bold text-base mb-3 px-0.5">Matched Item</Text>
          <PostComparisonCard post={matchedPost} />

          {/* ── Matched Attributes ── */}
          <MatchedAttributesSection similarPost={matchedPost} />
        </View>
      </ScrollView>

      {/* ── Bottom Action Bar ── */}
      <View className="bg-white border-t border-slate-100 px-4 pt-3 pb-6">
        <FormSubmitButton
          text="Contact Author"
          onPress={handleContactAuthor}
          isLoading={isCreating}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scoreRing: {
    width: 116,
    height: 116,
    borderRadius: 58,
    borderWidth: 7,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 4,
  },
  scoreNumber: {
    fontSize: 30,
    fontWeight: "800",
    lineHeight: 36,
  },
  scoreLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: "#94a3b8",
    letterSpacing: 1.5,
  },
});
