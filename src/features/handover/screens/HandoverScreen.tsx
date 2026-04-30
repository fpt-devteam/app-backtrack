import { useAppUser } from "@/src/features/auth/providers/user.provider";
import {
  HandoverCard,
  HandoverRequestCard,
} from "@/src/features/handover/components";
import { useGetC2CReturnReports } from "@/src/features/handover/hooks";
import { AppInlineError } from "@/src/shared/components";
import EmptyList from "@/src/shared/components/ui/EmptyList";
import { HANDOVER_ROUTE } from "@/src/shared/constants";
import { colors, metrics } from "@/src/shared/theme";
import { router, Stack } from "expo-router";
import { ArrowRightIcon } from "phosphor-react-native";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Section header ────────────────────────────────────────────────────────────

type SectionHeaderProps = {
  title: string;
  subtitle: string;
  count?: number;
};

const SectionHeader = ({ title, subtitle }: SectionHeaderProps) => (
  <View className="px-lg py-md2 gap-xs">
    <Text className="text-lg font-normal text-textPrimary">{title}</Text>
    <Text className="text-sm font-thin text-textSecondary">{subtitle}</Text>
  </View>
);

type SeeAllRowProps = {
  filter: "ongoing" | "past";
};

const SeeAllRow = ({ filter }: SeeAllRowProps) => (
  <TouchableOpacity
    onPress={() => router.push(HANDOVER_ROUTE.all(filter))}
    activeOpacity={0.75}
    className="flex-row items-center justify-center gap-xs"
  >
    <Text className="text-sm font-normal" style={{ color: colors.primary }}>
      See all
    </Text>
    <ArrowRightIcon size={16} color={colors.primary} />
  </TouchableOpacity>
);

// ─── Main screen ───────────────────────────────────────────────────────────────
const HandoverScreen = () => {
  const { user } = useAppUser();
  const currentUserId = user?.id ?? "";

  const {
    data: handovers,
    isLoading,
    isRefetching,
    error,
    refetch,
  } = useGetC2CReturnReports();

  // In-progress: Ongoing (coordinating) + Delivered (awaiting confirmation)
  const inProgressHandovers = useMemo(
    () =>
      handovers.filter(
        (r) => r.status === "Ongoing" || r.status === "Delivered",
      ),
    [handovers],
  );

  // Past: all completed or closed
  const pastHandovers = useMemo(
    () =>
      handovers.filter(
        (r) =>
          r.status === "Confirmed" ||
          r.status === "Closed" ||
          r.status === "Rejected",
      ),
    [handovers],
  );

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* ── Page header ──────────────────────────────────────────────── */}
      <View className="px-lg pt-lg pb-md gap-xs bg-surface">
        <View className="flex-row items-center gap-sm">
          <Text className="text-3xl font-normal text-textPrimary">
            Handover
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

      {/* Content */}
      {!isLoading && (!error || handovers.length > 0) && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: metrics.tabBar.height + metrics.spacing.lg,
          }}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={() => {
                void refetch();
              }}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
        >
          {/* In Progress section */}
          <View className="border-b-4 pb-sm border-divider">
            <SectionHeader
              title="In Progress"
              subtitle="These handovers still need delivery, confirmation, or review."
              count={inProgressHandovers.length}
            />

            <View className="px-lg">
              {inProgressHandovers.length === 0 ? (
                <EmptyList
                  title="No handovers need attention"
                  subtitle="When a chat turns into a return, the active handover will appear here."
                />
              ) : (
                <View className="gap-md2">
                  {inProgressHandovers.slice(0, 2).map((handover) => (
                    <HandoverCard key={handover.id} handover={handover} />
                  ))}

                  <SeeAllRow filter="ongoing" />
                </View>
              )}
            </View>
          </View>

          {/* ── Past section */}
          <View className="flex-1">
            <SectionHeader
              title="Past"
              subtitle="Completed or closed handovers you may want to reference later."
            />

            <View className="px-lg">
              {pastHandovers.length === 0 ? (
                <View className="pb-md">
                  <EmptyList
                    title="No completed handovers yet"
                    subtitle="Closed handovers will appear here once a return is completed or resolved."
                  />
                </View>
              ) : (
                <View style={{ paddingBottom: metrics.spacing.md }}>
                  {pastHandovers.slice(0, 2).map((handover) => (
                    <HandoverRequestCard
                      key={handover.id}
                      handover={handover}
                      currentUserId={currentUserId}
                    />
                  ))}

                  <SeeAllRow filter="past" />
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default HandoverScreen;
