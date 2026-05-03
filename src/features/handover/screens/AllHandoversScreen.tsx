import { HandoverCard } from "@/src/features/handover/components";
import { useGetC2CReturnReports } from "@/src/features/handover/hooks";
import { AppBackButton, AppInlineError } from "@/src/shared/components";
import { colors, metrics, typography } from "@/src/shared/theme";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextStyle,
  View,
} from "react-native";

type FilterParam = "ongoing" | "past";

const AllHandoversScreen = () => {
  const { filter } = useLocalSearchParams<{ filter: FilterParam }>();
  const { data: handovers, isLoading, error } = useGetC2CReturnReports();

  const filtered = useMemo(() => {
    if (filter === "ongoing") {
      return handovers.filter(
        (r) => r.status === "Ongoing" || r.status === "Delivered",
      );
    }
    return handovers.filter(
      (r) =>
        r.status === "Confirmed" ||
        r.status === "Closed" ||
        r.status === "Rejected",
    );
  }, [handovers, filter]);

  const title =
    filter === "ongoing" ? "In Progress Handovers" : "Past Handovers";

  return (
    <View className="flex-1 bg-surface">
      <Stack.Screen
        options={{
          headerTitle: title,
          headerLeft: () => (
            <AppBackButton type="arrowLeftIcon" showBackground={false} />
          ),
          headerTitleStyle: {
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeight.normal as TextStyle["fontWeight"],
          },
        }}
      />

      {isLoading && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}

      {!isLoading && error && (
        <View className="px-lg pt-md">
          <AppInlineError message={error.message} />
        </View>
      )}

      {!isLoading && !error && (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: metrics.spacing.lg,
            paddingTop: metrics.spacing.md,
            paddingBottom: metrics.spacing.xl,
          }}
          ItemSeparatorComponent={() => <View className="m-xs" />}
          renderItem={({ item }) => <HandoverCard handover={item} />}
          ListEmptyComponent={
            <Text className="text-sm text-textMuted text-center mt-lg">
              No handovers to show.
            </Text>
          }
        />
      )}
    </View>
  );
};

export default AllHandoversScreen;
