import { useLocationSelectionStore } from "@/src/features/map/store";
import { PostCard } from "@/src/features/post/components";
import { usePosts } from "@/src/features/post/hooks";
import type { PostFeedSection } from "@/src/features/post/hooks/usePosts";
import type {
  Post,
  PostCategory,
  PostFilters,
} from "@/src/features/post/types";
import { POST_CATEGORIES, PostType } from "@/src/features/post/types";
import { AppLoader } from "@/src/shared/components";
import { POST_ROUTE } from "@/src/shared/constants";
import { colors, metrics, typography } from "@/src/shared/theme";
import { router, Stack } from "expo-router";
import { MotiView } from "moti";
import { MotiPressable } from "moti/interactions";
import {
  ArrowRightIcon,
  BinocularsIcon,
  HandHeartIcon,
  HouseIcon,
  IconProps,
  MagnifyingGlassIcon,
} from "phosphor-react-native";
import React, { useCallback, useMemo, useState } from "react";
import { FlatList, Pressable, Text, TextStyle, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ExploreTabValue = "all" | PostType;

const EXPLORE_TABS: {
  key: ExploreTabValue;
  label: string;
  Icon: React.ComponentType<IconProps>;
}[] = [
  {
    key: "all",
    label: "All",
    Icon: HouseIcon,
  },
  {
    key: PostType.Lost,
    label: "Lost",
    Icon: BinocularsIcon,
  },
  {
    key: PostType.Found,
    label: "Found",
    Icon: HandHeartIcon,
  },
];

const SECTION_TITLES: Record<PostCategory, string> = {
  [POST_CATEGORIES.ELECTRONICS]: "Electronics",
  [POST_CATEGORIES.CARD]: "Card",
  [POST_CATEGORIES.PERSONAL_BELONGINGS]: "Personal Belongings",
  [POST_CATEGORIES.OTHER]: "Other",
};

const ExploreHeader = ({
  selectedTab,
  onChangeTab,
}: {
  selectedTab: ExploreTabValue;
  onChangeTab: (value: ExploreTabValue) => void;
}) => {
  const insets = useSafeAreaInsets();

  const handleOpenSearch = useCallback(() => {
    router.push(POST_ROUTE.search);
  }, []);

  const searchButtonAnimate = useMemo(
    () =>
      ({ hovered, pressed }: { hovered: boolean; pressed: boolean }) => {
        "worklet";

        const isPointerIn = hovered || pressed;

        return {
          scale: isPointerIn ? 0.95 : 1,
          opacity: isPointerIn ? 0.92 : 1,
          shadowOffset: isPointerIn
            ? { width: 0, height: 6 }
            : { width: 0, height: 4 },
          shadowRadius: isPointerIn ? 12 : 8,
          shadowOpacity: isPointerIn ? 0.2 : 0.15,
        };
      },
    [],
  );

  const searchButtonTransition = useMemo(
    () => () => {
      "worklet";

      return {
        type: "timing" as const,
        duration: 150,
      };
    },
    [],
  );

  return (
    <Stack.Screen
      options={{
        headerShown: true,
        header: () => (
          <View
            className="gap-md bg-surface"
            style={{ paddingTop: insets.top }}
          >
            <View className="px-md">
              <MotiPressable
                onPress={handleOpenSearch}
                animate={searchButtonAnimate}
                transition={searchButtonTransition}
                style={{
                  opacity: 1,
                  width: "100%",
                  height: metrics.layout.controlHeight.lg,
                  paddingVertical: metrics.spacing.sm,
                  borderRadius: 999,
                  backgroundColor: colors.surface,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: metrics.spacing.xs,
                  borderWidth: 0.75,
                  borderColor: colors.border.muted,
                  shadowColor: colors.black,
                  elevation: 8,
                }}
              >
                <MagnifyingGlassIcon
                  size={14}
                  color={colors.text.primary}
                  weight="bold"
                />

                <Text className="text-md font-md2 text-textPrimary">
                  Start your search
                </Text>
              </MotiPressable>
            </View>

            {/* Tabs */}
            <View className="flex-row items-center justify-evenly px-lg border-b border-muted">
              {EXPLORE_TABS.map(({ key, label, Icon }) => {
                const active = selectedTab === key;

                return (
                  <Pressable
                    key={key}
                    onPress={() => onChangeTab(key)}
                    className="items-center justify-center"
                    style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
                  >
                    <MotiView
                      className="items-center w-full gap-2"
                      animate={{
                        opacity: active ? 1 : 0.72,
                        scale: active ? 1.03 : 1,
                        translateY: active ? -1 : 0,
                      }}
                      transition={{ type: "timing", duration: 180 }}
                    >
                      <View className="flex-row items-center gap-xs">
                        <Icon
                          size={14}
                          color={
                            active ? colors.text.primary : colors.text.muted
                          }
                          weight={active ? "bold" : "regular"}
                        />

                        <Text
                          style={{
                            color: active
                              ? colors.text.primary
                              : colors.text.muted,
                            fontSize: typography.fontSize.sm,
                            fontWeight: active
                              ? (typography.fontWeight
                                  .normal as TextStyle["fontWeight"])
                              : (typography.fontWeight
                                  .thin as TextStyle["fontWeight"]),
                          }}
                        >
                          {label}
                        </Text>
                      </View>

                      <MotiView
                        animate={{
                          opacity: active ? 1 : 0,
                          scaleX: active ? 1 : 0.4,
                        }}
                        transition={{ type: "timing", duration: 200 }}
                        className="rounded-full bg-textPrimary w-full h-0.5"
                      />
                    </MotiView>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ),
      }}
    />
  );
};

const ExploreSectionRow = ({ section }: { section: PostFeedSection }) => {
  const renderCard = useCallback(
    ({ item }: { item: Post }) => <PostCard item={item} />,
    [],
  );

  return (
    <View className="gap-sm">
      <View className="flex-row items-center justify-between px-md">
        <Text
          style={{
            color: colors.text.primary,
            fontSize: typography.fontSize.lg,
          }}
        >
          {SECTION_TITLES[section.key]}
        </Text>

        <View className="p-sm rounded-full bg-slate-100 bg-opacity-10 mr-md">
          <ArrowRightIcon size={16} color={colors.secondary} weight="bold" />
        </View>
      </View>

      <FlatList
        data={section.items}
        horizontal
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        ItemSeparatorComponent={() => <View className="w-sm" />}
        contentContainerStyle={{ paddingHorizontal: metrics.spacing.md }}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export const PostScreen = () => {
  const { confirmedSelection } = useLocationSelectionStore();
  const insets = useSafeAreaInsets();
  const [selectedTab, setSelectedTab] = useState<ExploreTabValue>("all");

  const feedFilters = useMemo<PostFilters>(() => {
    return {
      postType: selectedTab === "all" ? undefined : selectedTab,
      radiusInKm: confirmedSelection?.radiusInKm,
      location: confirmedSelection?.location ?? { latitude: 0, longitude: 0 },
    };
  }, [confirmedSelection, selectedTab]);

  const { error, sections, isLoading, refetch } = usePosts({
    enabled: !!confirmedSelection?.location,
    filters: feedFilters,
  });

  const renderSection = useCallback(
    ({ item }: { item: PostFeedSection }) => (
      <ExploreSectionRow section={item} />
    ),
    [],
  );

  const listEmpty = useMemo(() => {
    if (isLoading)
      return (
        <View className="flex-1 items-center justify-center py-xl">
          <AppLoader />
        </View>
      );

    if (error) {
      return (
        <View className="px-lg pt-xl gap-sm items-start">
          <Text className="text-base text-textPrimary font-semibold">
            Couldn&apos;t load listings
          </Text>
          <Pressable
            onPress={() => void refetch()}
            className="rounded-full bg-secondary px-md py-sm"
            style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}
          >
            <Text className="text-sm text-secondary-foreground font-medium">
              Try again
            </Text>
          </Pressable>
        </View>
      );
    }

    return (
      <View className="px-lg pt-xl">
        <Text className="text-sm text-textSecondary">
          No posts found in this area yet.
        </Text>
      </View>
    );
  }, [error, isLoading, refetch]);

  return (
    <>
      <ExploreHeader selectedTab={selectedTab} onChangeTab={setSelectedTab} />

      <View className="flex-1 bg-surface">
        <FlatList
          data={sections}
          keyExtractor={(item) => item.key}
          renderItem={renderSection}
          ListEmptyComponent={listEmpty}
          contentContainerStyle={{
            paddingTop: metrics.spacing.md,
            paddingBottom: insets.bottom + metrics.spacing["2xl"],
            gap: metrics.spacing.lg,
          }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </>
  );
};
