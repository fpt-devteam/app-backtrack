// src/features/handover/screens/AllHandoversScreen.tsx

import { useAppUser } from "@/src/features/auth/providers/user.provider";
import { HandoverRequestCard } from "@/src/features/handover/components";
import { useGetC2CReturnReports } from "@/src/features/handover/hooks";
import { AppInlineError } from "@/src/shared/components";
import { colors, metrics } from "@/src/shared/theme";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { ArrowLeftIcon } from "phosphor-react-native";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type FilterParam = "ongoing" | "past";

const AllHandoversScreen = () => {
  const { filter } = useLocalSearchParams<{ filter: FilterParam }>();
  const { user } = useAppUser();
  const currentUserId = user?.id ?? "";

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

  const title = filter === "ongoing" ? "Ongoing" : "Past Handovers";

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
      <Stack.Screen options={{ headerShown: false }} />

      <View
        className="flex-row items-center px-lg pt-sm pb-sm bg-surface border-b border-divider"
        style={
          Platform.OS === "ios"
            ? { ...metrics.shadows.tabBar.ios }
            : metrics.shadows.tabBar.android
        }
      >
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          className="items-center justify-center rounded-full"
          style={{ width: 44, height: 44, backgroundColor: colors.hof[100] }}
        >
          <ArrowLeftIcon size={20} color={colors.text.primary} />
        </TouchableOpacity>
        <Text className="flex-1 text-base font-semibold text-textPrimary text-center">
          {title}
        </Text>
        <View style={{ width: 44, height: 44 }} />
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
            paddingTop: metrics.spacing.md,
            paddingBottom: metrics.spacing.xl,
          }}
          renderItem={({ item }) => (
            <HandoverRequestCard
              handover={item}
              currentUserId={currentUserId}
            />
          )}
          ListEmptyComponent={
            <Text className="text-sm text-textMuted text-center mt-lg">
              No handovers to show.
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default AllHandoversScreen;
