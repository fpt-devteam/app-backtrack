import { useAppUser } from "@/src/features/auth/providers/user.provider";
import { HandoverRequestCard } from "@/src/features/handover/components";
import { useGetC2CReturnReports } from "@/src/features/handover/hooks";
import { AppInlineError } from "@/src/shared/components";
import EmptyList from "@/src/shared/components/ui/EmptyList";
import { HANDOVER_ROUTE } from "@/src/shared/constants";
import { colors, metrics } from "@/src/shared/theme";
import { router, Stack } from "expo-router";
import { CaretRightIcon, HandshakeIcon } from "phosphor-react-native";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
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

// ─── See-all row ───────────────────────────────────────────────────────────────

type SeeAllRowProps = {
  count: number;
  filter: "ongoing" | "past";
};

const SeeAllRow = ({ count, filter }: SeeAllRowProps) => (
  <TouchableOpacity
    onPress={() => router.push(HANDOVER_ROUTE.all(filter))}
    activeOpacity={0.75}
    className="flex-row items-center justify-center gap-xs py-xs mt-xs"
  >
    <Text className="text-sm font-semibold" style={{ color: colors.primary }}>
      See all {count}
    </Text>
    <CaretRightIcon size={13} color={colors.primary} />
  </TouchableOpacity>
);

// ─── Main screen ───────────────────────────────────────────────────────────────

const HandoverScreen = () => {
  const { user } = useAppUser();
  const currentUserId = user?.id ?? "";

  const { data: handovers, isLoading, error } = useGetC2CReturnReports();

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
      <View
        className="px-lg pt-lg pb-md gap-xs bg-surface"
        style={{
          borderBottomWidth: 1,
          borderBottomColor: colors.hof[200],
        }}
      >
        <View className="flex-row items-center gap-sm">
          <HandshakeIcon
            size={24}
            color={colors.rausch[500]}
            weight="duotone"
          />
          <Text className="text-2xl font-semibold text-textPrimary">
            Handovers
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
      {!isLoading && (!error || handovers.length > 0) && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: metrics.spacing.xl }}
        >
          {/* ── In Progress section (Draft + Active) ───────────────────── */}
          <View
            className="pt-sm"
            style={{
              borderBottomWidth: 8,
              borderBottomColor: colors.hof[100],
            }}
          >
            <SectionHeader
              title="In Progress"
              subtitle="These handovers still need delivery, confirmation, or review."
              count={inProgressHandovers.length}
            />

            <View className="px-lg">
              {inProgressHandovers.length === 0 ? (
                <View className="pb-md">
                  <EmptyList
                    title="No handovers need attention"
                    subtitle="When a chat turns into a return, the active handover will appear here."
                  />
                </View>
              ) : (
                <View style={{ paddingBottom: metrics.spacing.md }}>
                  {inProgressHandovers.slice(0, 3).map((handover) => (
                    <HandoverRequestCard
                      key={handover.id}
                      handover={handover}
                      currentUserId={currentUserId}
                    />
                  ))}
                  {inProgressHandovers.length > 3 && (
                    <SeeAllRow
                      count={inProgressHandovers.length}
                      filter="ongoing"
                    />
                  )}
                </View>
              )}
            </View>
          </View>

          {/* ── Past section ───────────────────────────────────────────── */}
          <View>
            <SectionHeader
              title="Past"
              subtitle="Completed or closed handovers you may want to reference later."
              count={
                pastHandovers.length > 0 ? pastHandovers.length : undefined
              }
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
                  {pastHandovers.slice(0, 3).map((handover) => (
                    <HandoverRequestCard
                      key={handover.id}
                      handover={handover}
                      currentUserId={currentUserId}
                    />
                  ))}
                  {pastHandovers.length > 3 && (
                    <SeeAllRow count={pastHandovers.length} filter="past" />
                  )}
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
