import type { AppUser } from "@/src/features/auth/types";
import { useGetC2CReturnReportById } from "@/src/features/handover/hooks";
import type {
  Handover,
  ReturnReportStatus,
} from "@/src/features/handover/types";
import { PostStatusBadge } from "@/src/features/post/components";
import type { Post } from "@/src/features/post/types";
import {
  AppImage,
  AppInlineError,
  AppUserAvatar,
} from "@/src/shared/components";
import { POST_ROUTE } from "@/src/shared/constants";
import { colors, metrics } from "@/src/shared/theme";
import { formatDate, formatShortEventTime } from "@/src/shared/utils";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import {
  ArrowLeftIcon,
  CalendarBlankIcon,
  CalendarCheckIcon,
  CalendarXIcon,
  ClockCountdownIcon,
  HandshakeIcon,
  MapPinIcon,
  UserIcon,
} from "phosphor-react-native";
import React, { useCallback } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type StatusTheme = { label: string; color: string; bgColor: string };

const STATUS_THEME: Record<ReturnReportStatus, StatusTheme> = {
  Draft: {
    label: "Draft",
    color: colors.hof[500],
    bgColor: colors.hof[100],
  },
  Active: {
    label: "Active",
    color: colors.kazan[600],
    bgColor: "#FFF8E1",
  },
  Confirmed: {
    label: "Confirmed",
    color: colors.emerald[600],
    bgColor: "#ecfdf5",
  },
  Rejected: {
    label: "Rejected",
    color: colors.error[500],
    bgColor: "#fef2f2",
  },
  Expired: {
    label: "Expired",
    color: colors.hof[400],
    bgColor: colors.hof[100],
  },
};

function deriveTitle(report: Handover): string {
  const finderName = report.finderPost?.item.itemName;
  const ownerName = report.ownerPost?.item.itemName;
  if (finderName && ownerName) return `${finderName} ↔ ${ownerName}`;
  if (finderName) return `Found: ${finderName}`;
  if (ownerName) return `Lost: ${ownerName}`;
  return "Return Report";
}

const HandoverStatusBadge = ({ status }: { status: ReturnReportStatus }) => {
  const { label, color, bgColor } = STATUS_THEME[status];
  return (
    <View
      className="self-start px-3 py-1 rounded-full"
      style={{ backgroundColor: bgColor, borderWidth: 1, borderColor: color }}
    >
      <Text className="text-xs font-bold" style={{ color }}>
        {label}
      </Text>
    </View>
  );
};

const PostCard = ({ post, label }: { post: Post; label: string }) => {
  const imageUrl = post.imageUrls?.[0];

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(POST_ROUTE.details(post.id));
  }, [post.id]);

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      className="flex-1 overflow-hidden rounded-2xl border border-divider"
      style={
        Platform.OS === "ios"
          ? metrics.shadows.level1.ios
          : metrics.shadows.level1.android
      }
    >
      {/* Image */}
      <View style={{ aspectRatio: 1 }}>
        <AppImage
          source={{ uri: imageUrl }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
        <View className="absolute top-2 left-2">
          <PostStatusBadge status={post.postType} size="sm" />
        </View>
      </View>

      {/* Info */}
      <View className="px-3 py-2.5 gap-1 bg-surface">
        <Text className="text-xs font-semibold text-textMuted uppercase tracking-wide">
          {label}
        </Text>
        <Text className="text-sm font-bold text-textPrimary" numberOfLines={2}>
          {post.item.itemName}
        </Text>
        <View className="flex-row items-center gap-1">
          <MapPinIcon size={11} color={colors.text.muted} weight="fill" />
          <Text className="flex-1 text-xs text-textMuted" numberOfLines={1}>
            {post.displayAddress ?? "—"}
          </Text>
        </View>
        <View className="flex-row items-center gap-1">
          <CalendarBlankIcon
            size={11}
            color={colors.text.muted}
            weight="regular"
          />
          <Text className="flex-1 text-xs text-textMuted" numberOfLines={1}>
            {formatShortEventTime(post.eventTime)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const EmptyPostCard = ({ label }: { label: string }) => (
  <View
    className="flex-1 rounded-2xl border border-divider items-center justify-center bg-canvas"
    style={{ aspectRatio: 0.75 }}
  >
    <Text className="text-xs text-textMuted">{label}</Text>
    <Text className="text-xs text-textMuted mt-1">Not linked yet</Text>
  </View>
);

type PartyRowProps = {
  user: AppUser | null;
  role: "Finder" | "Owner";
};

const PartyRow = ({ user, role }: PartyRowProps) => {
  const roleColor = role === "Finder" ? colors.babu[400] : colors.kazan[500];
  const roleBg = role === "Finder" ? "#EFF6FF" : "#FFF8E1";

  return (
    <View className="flex-row items-center gap-md py-sm px-md">
      {user ? (
        <AppUserAvatar avatarUrl={user.avatarUrl} size={44} />
      ) : (
        <View
          className="rounded-full items-center justify-center bg-muted"
          style={{ width: 44, height: 44 }}
        >
          <UserIcon size={22} color={colors.hof[400]} />
        </View>
      )}
      <View className="flex-1">
        <Text className="text-sm font-semibold text-textPrimary">
          {user?.displayName ?? "Not assigned"}
        </Text>
        {user?.phone && (
          <Text className="text-xs text-textMuted">{user.phone}</Text>
        )}
      </View>
      <View
        className="px-2.5 py-1 rounded-full"
        style={{ backgroundColor: roleBg }}
      >
        <Text className="text-xs font-semibold" style={{ color: roleColor }}>
          {role}
        </Text>
      </View>
    </View>
  );
};

type TimelineRowProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

const TimelineRow = ({ icon, label, value }: TimelineRowProps) => (
  <View className="flex-row items-center gap-md py-sm px-md">
    <View
      className="w-9 h-9 rounded-full items-center justify-center bg-canvas"
      style={{ borderWidth: 1, borderColor: colors.divider }}
    >
      {icon}
    </View>
    <View className="flex-1">
      <Text className="text-xs text-textMuted">{label}</Text>
      <Text className="text-sm font-semibold text-textPrimary">{value}</Text>
    </View>
  </View>
);

type SectionCardProps = {
  title: string;
  children: React.ReactNode;
};

const SectionCard = ({ title, children }: SectionCardProps) => (
  <View className="mb-4">
    <Text className="text-xs font-bold text-textMuted uppercase tracking-wide mb-2 px-1">
      {title}
    </Text>
    <View
      className="bg-surface rounded-2xl overflow-hidden border border-divider"
      style={
        Platform.OS === "ios"
          ? metrics.shadows.level1.ios
          : metrics.shadows.level1.android
      }
    >
      {children}
    </View>
  </View>
);

const Separator = () => <View className="h-px bg-divider mx-md" />;

const HandoverDetailScreen = () => {
  const { handoverId } = useLocalSearchParams<{ handoverId: string }>();
  const {
    data: report,
    isLoading,
    error,
  } = useGetC2CReturnReportById(handoverId ?? "");

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
        <View className="flex-row items-center px-lg pt-md pb-sm gap-sm">
          <TouchableOpacity
            onPress={() => router.back()}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <ArrowLeftIcon size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !report) {
    return (
      <SafeAreaView className="flex-1 bg-canvas" edges={["top"]}>
        <View className="flex-row items-center px-lg pt-md pb-sm gap-sm">
          <TouchableOpacity
            onPress={() => router.back()}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <ArrowLeftIcon size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
        <AppInlineError message={error?.message ?? "Handover not found."} />
      </SafeAreaView>
    );
  }

  const showActions = report.status === "Active" || report.status === "Draft";

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 20,
          paddingBottom: 40,
        }}
      >
        {/* ── Hero ── */}
        <View className="mb-5">
          <HandoverStatusBadge status={report.status} />
          <Text
            className="text-2xl font-bold text-textPrimary mt-2"
            numberOfLines={2}
          >
            {deriveTitle(report)}
          </Text>
          <View className="flex-row items-center gap-xs mt-1">
            <CalendarBlankIcon size={13} color={colors.text.muted} />
            <Text className="text-sm text-textMuted">
              Created {formatDate(report.createdAt)}
            </Text>
          </View>
        </View>

        {/* ── Section 1: Items Involved ── */}
        <View className="mb-4">
          <Text className="text-xs font-bold text-textMuted uppercase tracking-wide mb-2 px-1">
            Items Involved
          </Text>
          <View className="flex-row gap-3">
            {report.finderPost ? (
              <PostCard post={report.finderPost} label="Found by finder" />
            ) : (
              <EmptyPostCard label="Finder's Post" />
            )}
            {report.ownerPost ? (
              <PostCard post={report.ownerPost} label="Lost by owner" />
            ) : (
              <EmptyPostCard label="Owner's Post" />
            )}
          </View>
        </View>

        {/* ── Section 2: Parties ── */}
        <SectionCard title="Parties">
          <PartyRow user={report.finder} role="Finder" />
          <Separator />
          <PartyRow user={report.owner} role="Owner" />
        </SectionCard>

        {/* ── Section 3: Timeline ── */}
        <SectionCard title="Timeline">
          <TimelineRow
            icon={
              <HandshakeIcon size={18} color={colors.hof[500]} weight="fill" />
            }
            label="Created"
            value={formatDate(report.createdAt)}
          />
          <Separator />
          <TimelineRow
            icon={
              <ClockCountdownIcon
                size={18}
                color={colors.kazan[500]}
                weight="fill"
              />
            }
            label="Expires"
            value={formatDate(report.expiresAt)}
          />
          {report.confirmedAt && (
            <>
              <Separator />
              <TimelineRow
                icon={
                  <CalendarCheckIcon
                    size={18}
                    color={colors.emerald[600]}
                    weight="fill"
                  />
                }
                label="Confirmed"
                value={formatDate(report.confirmedAt)}
              />
            </>
          )}
          {report.status === "Rejected" && (
            <>
              <Separator />
              <TimelineRow
                icon={
                  <CalendarXIcon
                    size={18}
                    color={colors.error[500]}
                    weight="fill"
                  />
                }
                label="Rejected"
                value={formatDate(report.expiresAt)}
              />
            </>
          )}
        </SectionCard>

        {/* ── Section 4: Actions ── */}
        {showActions && (
          <View className="mt-2 gap-3">
            {report.status === "Active" && (
              <>
                <TouchableOpacity
                  activeOpacity={0.85}
                  className="items-center justify-center rounded-xl"
                  style={{
                    height: metrics.layout.controlHeight.xl,
                    backgroundColor: colors.primary,
                  }}
                  onPress={() => {
                    /* TODO: confirm action */
                  }}
                >
                  <Text className="text-base font-semibold text-white">
                    Confirm Return
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.85}
                  className="items-center justify-center rounded-xl border"
                  style={{
                    height: metrics.layout.controlHeight.xl,
                    borderColor: colors.error[500],
                  }}
                  onPress={() => {
                    /* TODO: reject action */
                  }}
                >
                  <Text
                    className="text-base font-semibold"
                    style={{ color: colors.error[500] }}
                  >
                    Reject
                  </Text>
                </TouchableOpacity>
              </>
            )}
            {report.status === "Draft" && (
              <TouchableOpacity
                activeOpacity={0.85}
                className="items-center justify-center rounded-xl border"
                style={{
                  height: metrics.layout.controlHeight.xl,
                  borderColor: colors.error[500],
                }}
                onPress={() => {
                  /* TODO: cancel draft */
                }}
              >
                <Text
                  className="text-base font-semibold"
                  style={{ color: colors.error[500] }}
                >
                  Cancel Handover
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HandoverDetailScreen;
