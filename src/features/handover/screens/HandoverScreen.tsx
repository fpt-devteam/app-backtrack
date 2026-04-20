// src/features/handover/screens/HandoverScreen.tsx

import { useAppUser } from "@/src/features/auth/providers/user.provider";
import {
  HandoverRequestCard,
} from "@/src/features/handover/components";
import { useGetC2CReturnReports } from "@/src/features/handover/hooks";
import type { Handover } from "@/src/features/handover/types";
import { AppInlineError } from "@/src/shared/components";
import EmptyList from "@/src/shared/components/ui/EmptyList";
import { colors, metrics } from "@/src/shared/theme";
import { Stack } from "expo-router";
import { HandshakeIcon } from "phosphor-react-native";
import React, { useCallback, useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Section header ────────────────────────────────────────────────────────────

type SectionHeaderProps = {
  title: string;
  subtitle: string;
  count?: number;
};

const SectionHeader = ({ title, subtitle, count }: SectionHeaderProps) => (
  <View className="px-lg pt-lg pb-sm">
    <View className="flex-row items-center gap-xs mb-xs">
      <Text className="text-lg font-semibold text-textPrimary">{title}</Text>
      {count !== undefined && count > 0 && (
        <View
          className="px-2 py-0.5 rounded-full"
          style={{ backgroundColor: colors.rausch[100] }}
        >
          <Text
            className="text-xs font-semibold"
            style={{ color: colors.rausch[500] }}
          >
            {count}
          </Text>
        </View>
      )}
    </View>
    <Text className="text-sm text-textSecondary">{subtitle}</Text>
  </View>
);

// ─── Main screen ───────────────────────────────────────────────────────────────

const HandoverScreen = () => {
  const { user } = useAppUser();
  const currentUserId = user?.id ?? "";

  const { data: handovers, isLoading, error } = useGetC2CReturnReports();

  // In-progress: Draft (coordinating) + Active (delivery pending confirmation)
  const inProgressHandovers = useMemo(
    () =>
      handovers.filter(
        (r) => r.status === "Draft" || r.status === "Active",
      ),
    [handovers],
  );

  // Past: all completed, expired, or rejected
  const pastHandovers = useMemo(
    () =>
      handovers.filter(
        (r) =>
          r.status === "Confirmed" ||
          r.status === "Expired" ||
          r.status === "Rejected",
      ),
    [handovers],
  );

  const keyExtractor = useCallback((item: Handover) => item.id, []);

  const renderItem = useCallback(
    ({ item }: { item: Handover }) => (
      <HandoverRequestCard handover={item} currentUserId={currentUserId} />
    ),
    [currentUserId],
  );

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* ── Page header ──────────────────────────────────────────────── */}
      <View
        className="px-lg pt-lg pb-md flex-row items-center gap-sm"
        style={{
          borderBottomWidth: 1,
          borderBottomColor: colors.hof[200],
        }}
      >
        <HandshakeIcon size={28} color={colors.rausch[500]} weight="duotone" />
        <View>
          <Text className="text-2xl font-semibold text-textPrimary">
            Handovers
          </Text>
          <Text className="text-xs text-textMuted">
            {handovers.length} report{handovers.length !== 1 ? "s" : ""}
          </Text>
        </View>
      </View>

      {/* ── Loading ──────────────────────────────────────────────────── */}
      {isLoading && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}

      {/* ── Error ────────────────────────────────────────────────────── */}
      {!isLoading && error && (
        <View className="px-lg pt-md">
          <AppInlineError message={error.message} />
        </View>
      )}

      {/* ── Content ──────────────────────────────────────────────────── */}
      {!isLoading && !error && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: metrics.spacing.xl }}
        >
          {/* ── In Progress section (Draft + Active) ───────────────────── */}
          <View
            style={{
              borderBottomWidth: 8,
              borderBottomColor: colors.hof[100],
            }}
          >
            <SectionHeader
              title="In Progress"
              subtitle="Coordinate via chat, then confirm the handover when ready."
              count={inProgressHandovers.length}
            />

            <View className="px-lg">
              {inProgressHandovers.length === 0 ? (
                <View className="pb-md">
                  <EmptyList
                    title="No active handovers"
                    subtitle="When you and a match start chatting, a draft will appear here."
                  />
                </View>
              ) : (
                <FlatList
                  data={inProgressHandovers}
                  keyExtractor={keyExtractor}
                  renderItem={renderItem}
                  scrollEnabled={false}
                  contentContainerStyle={{ paddingBottom: metrics.spacing.md }}
                />
              )}
            </View>
          </View>

          {/* ── Past section ───────────────────────────────────────────── */}
          {(pastHandovers.length > 0 || !isLoading) && (
            <View>
              <SectionHeader
                title="Past"
                subtitle="Completed, expired, and rejected returns."
                count={pastHandovers.length > 0 ? pastHandovers.length : undefined}
              />

              <View className="px-lg">
                {pastHandovers.length === 0 ? (
                  <View className="pb-md">
                    <EmptyList
                      title="No past handovers"
                      subtitle="Completed returns will appear here."
                    />
                  </View>
                ) : (
                  <FlatList
                    data={pastHandovers}
                    keyExtractor={keyExtractor}
                    renderItem={renderItem}
                    scrollEnabled={false}
                    contentContainerStyle={{ paddingBottom: metrics.spacing.md }}
                  />
                )}
              </View>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default HandoverScreen;
