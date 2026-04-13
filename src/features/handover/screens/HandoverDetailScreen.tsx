// src/features/handover/screens/HandoverDetailScreen.tsx

import { useGetC2CReturnReportById } from "@/src/features/handover/hooks";
import type { Handover } from "@/src/features/handover/types";
import { PostStatusBadge } from "@/src/features/post/components";
import type { Post } from "@/src/features/post/types";
import { AppImage, AppInlineError } from "@/src/shared/components";
import { POST_ROUTE } from "@/src/shared/constants";
import { colors } from "@/src/shared/theme";
import { formatDate } from "@/src/shared/utils";
import * as Haptics from "expo-haptics";
import { router, Stack, useLocalSearchParams } from "expo-router";
import {
  ArrowLeftIcon,
  CalendarBlankIcon,
  CaretRightIcon,
  MapPinIcon,
  PackageIcon,
} from "phosphor-react-native";
import React, { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Sub-components ───────────────────────────────────────────────

const PostRow = ({ post }: { post: Post }) => {
  const imageUrl = post.imageUrls?.[0];

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(POST_ROUTE.details(post.id));
  }, [post.id]);

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.75}
      className="flex-row items-center gap-md py-sm"
    >
      {/* Thumbnail */}
      <View
        className="rounded-xl overflow-hidden"
        style={{ width: 72, height: 72 }}
      >
        <AppImage
          source={{ uri: imageUrl }}
          style={{ width: 72, height: 72 }}
          resizeMode="cover"
        />
      </View>

      {/* Info */}
      <View className="flex-1 gap-xs">
        <View className="flex-row items-center gap-xs">
          <PostStatusBadge status={post.postType} size="sm" />
        </View>
        <Text
          className="text-sm font-semibold text-textPrimary"
          numberOfLines={1}
        >
          {post.item.itemName}
        </Text>
        <View className="flex-row items-center gap-xs">
          <MapPinIcon size={12} color={colors.text.muted} weight="fill" />
          <Text className="flex-1 text-xs text-textMuted" numberOfLines={1}>
            {post.displayAddress ?? "Location not specified"}
          </Text>
        </View>
      </View>

      {/* Chevron */}
      <CaretRightIcon size={16} color={colors.text.muted} />
    </TouchableOpacity>
  );
};

const PostRowSeparator = () => <View className="h-px bg-divider ml-[88px]" />;

function deriveDisplayName(report: Handover): string {
  const finderName = report.finderPost?.item.itemName;
  const ownerName = report.ownerPost?.item.itemName;
  if (finderName && ownerName) return `${finderName} ↔ ${ownerName}`;
  if (finderName) return `Found: ${finderName}`;
  if (ownerName) return `Lost: ${ownerName}`;
  return "Return Report";
}

// ─── Main Screen ──────────────────────────────────────────────────

const HandoverDetailScreen = () => {
  const { handoverId } = useLocalSearchParams<{ handoverId: string }>();
  const {
    data: report,
    isLoading,
    error,
  } = useGetC2CReturnReportById(handoverId ?? "");

  const BackHeader = () => (
    <View className="flex-row items-center px-lg pt-md pb-sm gap-sm">
      <TouchableOpacity
        onPress={() => router.back()}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <ArrowLeftIcon size={24} color={colors.text.primary} />
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
        <Stack.Screen options={{ headerShown: false }} />
        <BackHeader />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !report) {
    return (
      <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
        <Stack.Screen options={{ headerShown: false }} />
        <BackHeader />
        <AppInlineError message={error?.message ?? "Handover not found."} />
      </SafeAreaView>
    );
  }

  const formattedDate = formatDate(report.createdAt);
  const posts = [report.finderPost, report.ownerPost].filter(
    (p): p is Post => p != null,
  );
  const postCount = posts.length;

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View className="flex-row items-center px-lg pt-md pb-sm gap-sm">
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <ArrowLeftIcon size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text
          className="flex-1 text-base font-semibold text-textPrimary"
          numberOfLines={1}
        >
          Handover details
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Hero section */}
        <View className="px-lg pt-sm pb-lg gap-xs">
          <Text className="text-2xl font-bold text-textPrimary">
            {deriveDisplayName(report)}
          </Text>

          {/* Meta row */}
          <View className="flex-row items-center gap-lg mt-xs">
            <View className="flex-row items-center gap-xs">
              <CalendarBlankIcon size={14} color={colors.text.muted} />
              <Text className="text-sm text-textMuted">{formattedDate}</Text>
            </View>
            <View className="flex-row items-center gap-xs">
              <PackageIcon size={14} color={colors.text.muted} />
              <Text className="text-sm text-textMuted">
                {postCount} {postCount === 1 ? "item" : "items"}
              </Text>
            </View>
          </View>
        </View>

        {/* Divider */}
        <View className="h-px bg-divider mx-lg mb-lg" />

        {/* Posts section */}
        <View className="px-lg">
          <Text className="text-base font-semibold text-textPrimary mb-sm">
            Items in this handover
          </Text>

          <View className="rounded-2xl bg-canvas overflow-hidden">
            <FlatList
              data={posts}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <PostRow post={item} />}
              ItemSeparatorComponent={PostRowSeparator}
              scrollEnabled={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HandoverDetailScreen;
