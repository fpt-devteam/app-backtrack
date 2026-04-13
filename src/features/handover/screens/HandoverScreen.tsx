import {
  HandoverCard,
  HandoverRequestCard,
} from "@/src/features/handover/components";
import { useGetC2CReturnReports } from "@/src/features/handover/hooks";
import { type Handover } from "@/src/features/handover/types";
import { AppInlineError } from "@/src/shared/components";
import EmptyList from "@/src/shared/components/ui/EmptyList";
import { POST_ROUTE } from "@/src/shared/constants";
import { colors, metrics } from "@/src/shared/theme";
import { router, Stack } from "expo-router";
import { ArrowRightIcon } from "phosphor-react-native";
import React, { useCallback, useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HANDOVER_MOCK, IS_HANDOVER_MOCK } from "../constants";

const HandoverScreen = () => {
  const { width } = useWindowDimensions();
  const cardWidth = useMemo(() => 0.9 * width, [width]);

  const { data, isLoading, error } = useGetC2CReturnReports();

  const reports = useMemo(() => {
    if (IS_HANDOVER_MOCK) return HANDOVER_MOCK;
    return data?.items ?? [];
  }, [data, IS_HANDOVER_MOCK]);

  const draftReports = useMemo(
    () => reports.filter((report) => report.status === "Draft"),
    [reports],
  );

  const handleGetStarted = useCallback(() => {
    router.push(POST_ROUTE.index);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Handover }) => (
      <HandoverCard report={item} width={cardWidth} />
    ),
    [cardWidth],
  );

  const renderDraftHandoverItem = useCallback(
    ({ item }: { item: Handover }) => <HandoverRequestCard handover={item} />,
    [],
  );

  const keyExtractor = useCallback((item: Handover) => item.id, []);

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Title */}
      <View className="px-lg pt-lg pb-sm">
        <Text className="text-3xl font-normal text-textPrimary">Handovers</Text>
      </View>

      {/* Loading */}
      {isLoading && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}

      {/* Error */}
      {!isLoading && error && <AppInlineError message={error.message} />}

      {/* Divider */}
      <View className="h-2 bg-border" />

      {/* Draft Handovers Section */}
      <View className="bg-surface py-md pb-md2 px-sm overflow-hidden">
        <View className="flex-col justify-between gap-xs ">
          <Text className="text-xl font-medium text-textPrimary ">
            Draft Handovers ({draftReports.length})
          </Text>

          <Text className="text-sm font-normal text-textSecondary">
            {/* Some information about the draft handovers */}
            Pick up where you left off. These reports are only visible to you
            until the handover is confirmed.
          </Text>
        </View>

        {/* Draft Handovers */}
        <FlatList
          data={draftReports.slice(0, 2)}
          keyExtractor={keyExtractor}
          renderItem={renderDraftHandoverItem}
          scrollEnabled={false}
          className="bg-surface"
          contentContainerStyle={{
            flexGrow: 0,
          }}
          ListFooterComponent={() => {
            return (
              <Pressable
                className="flex-row items-center justify-center gap-xs pt-md2"
                onPress={() => router.push("/handover/drafts")}
              >
                <Text className="text-normal font-semibold text-textMuted">
                  Show all
                </Text>

                <ArrowRightIcon
                  size={16}
                  weight="bold"
                  color={colors.text.muted}
                />
              </Pressable>
            );
          }}
        />
      </View>

      {/* Divider */}
      <View className="h-2 bg-border" />

      {/* Active Handovers Section */}
      <View className="bg-surface py-md overflow-hidden">
        <View className="flex-col justify-between gap-xs px-sm ">
          <Text className="text-xl font-medium text-textPrimary ">
            Ongoing Handovers
          </Text>

          <Text className="text-sm font-normal text-textSecondary">
            Manage and track your active return sessions. Stay updated on the
            progress of each case.
          </Text>
        </View>

        {/* Active Handovers */}
        <FlatList
          data={reports.slice(0, 2)}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          className="bg-surface px-sm "
          contentContainerStyle={{
            flexGrow: 0,
            gap: metrics.spacing.md,
          }}
          ListEmptyComponent={
            <EmptyList
              title="No active handovers"
              subtitle="You don't have any active handovers at the moment."
            />
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default HandoverScreen;
