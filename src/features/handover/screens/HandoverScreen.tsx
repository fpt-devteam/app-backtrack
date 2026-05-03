import { useAuth } from "@/src/features/auth/providers";
import { HandoverCard } from "@/src/features/handover/components";
import { useGetC2CReturnReports } from "@/src/features/handover/hooks";
import { AppButton, AppInlineError } from "@/src/shared/components";
import EmptyList from "@/src/shared/components/ui/EmptyList";
import { AUTH_ROUTE, HANDOVER_ROUTE } from "@/src/shared/constants";
import { colors, metrics, typography } from "@/src/shared/theme";
import { router, Stack } from "expo-router";
import {
  ArrowRightIcon,
  HandshakeIcon,
  PackageIcon,
} from "phosphor-react-native";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TextStyle,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

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

const GuestView = () => {
  const layout = useWindowDimensions();

  return (
    <View
      className="flex-1 bg-surface px-lg gap-lg"
      style={{ paddingTop: layout.height * 0.15 }}
    >
      <View className="flex-row justify-center">
        <HandshakeIcon size={128} color={colors.secondary} weight="thin" />
      </View>

      <View className="gap-y-2">
        <Text className="text-xl font-normal text-textPrimary text-center">
          Log in to view your conversations
        </Text>

        <Text className="text-base font-thin text-textSecondary text-center leading-6">
          Once you log in, you will find all your conversations here.
        </Text>
      </View>

      <AppButton
        onPress={() => router.push(AUTH_ROUTE.onboarding)}
        title="Login or Sign up"
        variant="secondary"
      />
    </View>
  );
};

const HandoverScreen = () => {
  const { isAppReady, isLoggedIn } = useAuth();

  const {
    data: handovers,
    isLoading,
    isRefetching,
    error,
    refetch,
  } = useGetC2CReturnReports();

  const inProgressHandovers = useMemo(
    () =>
      handovers.filter(
        (r) => r.status === "Ongoing" || r.status === "Delivered",
      ),
    [handovers],
  );

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

  const renderContent = () => {
    if (!isAppReady || !isLoggedIn) {
      return <GuestView />;
    }

    if (isLoading) {
      return (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }

    if (error) {
      return (
        <View className="px-lg pt-md">
          <AppInlineError message={error.message} />
        </View>
      );
    }

    return (
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
        <View className="border-b-8 pb-sm border-divider">
          <SectionHeader
            title="In Progress"
            subtitle="These handovers still need delivery, confirmation, or review."
            count={inProgressHandovers.length}
          />

          <View className="px-lg">
            {inProgressHandovers.length === 0 ? (
              <EmptyList
                icon={
                  <PackageIcon
                    size={96}
                    color={colors.secondary}
                    weight="thin"
                  />
                }
                title="No handovers need attention"
                subtitle="When a chat turns into a return, the active handover will appear here."
              />
            ) : (
              <View className="gap-md2">
                {inProgressHandovers.slice(0, 2).map((handover) => (
                  <HandoverCard key={handover.id} handover={handover} />
                ))}

                {inProgressHandovers.length > 2 && (
                  <SeeAllRow filter="ongoing" />
                )}
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

          <View className="flex-1 px-lg">
            {pastHandovers.length === 0 ? (
              <View className="flex-1 items-center justify-center">
                <EmptyList
                  icon={
                    <PackageIcon
                      size={96}
                      color={colors.secondary}
                      weight="thin"
                    />
                  }
                  title="No completed handovers yet"
                  subtitle="Closed handovers will appear here once a return is completed or resolved."
                />
              </View>
            ) : (
              <View className="gap-md2">
                {pastHandovers.slice(0, 2).map((handover) => (
                  <HandoverCard key={handover.id} handover={handover} />
                ))}

                {pastHandovers.length > 2 && <SeeAllRow filter="past" />}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    );
  };

  return (
    <View className="flex-1 bg-surface">
      <Stack.Screen
        options={{
          headerTitle: "Handovers",
          headerTitleStyle: {
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeight.normal as TextStyle["fontWeight"],
          },
        }}
      />
      {renderContent()}
    </View>
  );
};

export default HandoverScreen;
