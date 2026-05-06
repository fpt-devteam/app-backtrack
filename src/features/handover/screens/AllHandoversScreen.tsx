import { HandoverCard } from "@/src/features/handover/components";
import { useGetC2CReturnReports } from "@/src/features/handover/hooks";
import {
  AppBackButton,
  AppChipsRow,
  AppInlineError,
} from "@/src/shared/components";
import { colors, metrics, typography } from "@/src/shared/theme";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextStyle,
  View,
} from "react-native";

type FilterParam = "ongoing" | "past";

type HandoverFilter =
  | "All"
  | "Ongoing"
  | "Delivered"
  | "Confirmed"
  | "Closed"
  | "Rejected";

const STATUS_TABS: { key: HandoverFilter; label: string }[] = [
  { key: "All", label: "All" },
  { key: "Ongoing", label: "Ongoing" },
  { key: "Delivered", label: "Delivered" },
  { key: "Confirmed", label: "Confirmed" },
  { key: "Closed", label: "Closed" },
  { key: "Rejected", label: "Rejected" },
];

const ONGOING_STATUS: HandoverFilter[] = ["All", "Ongoing", "Delivered"];

const PAST_STATUS: HandoverFilter[] = [
  "All",
  "Confirmed",
  "Closed",
  "Rejected",
];

const AllHandoversScreen = () => {
  const { filter } = useLocalSearchParams<{ filter: FilterParam }>();
  const { data: handovers, isLoading, error } = useGetC2CReturnReports();

  const [selectedTab, setSelectedTab] = useState<HandoverFilter>("All");

  const filtered = useMemo(() => {
    if (selectedTab !== "All") {
      return handovers.filter((r) => r.status === selectedTab);
    }

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
  }, [handovers, filter, selectedTab]);

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

      <View className="flex-row items-center justify-between px-lg py-sm">
        <AppChipsRow
          chips={
            filter === "ongoing"
              ? ONGOING_STATUS.map((status) => ({
                  label: status,
                  selected: selectedTab === status,
                  onPress: () => setSelectedTab(status),
                }))
              : PAST_STATUS.map((status) => ({
                  label: status,
                  selected: selectedTab === status,
                  onPress: () => setSelectedTab(status),
                }))
          }
        />
      </View>

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
