import { MyPostCard } from "@/src/features/post/components";
import { useGetAllMyPost } from "@/src/features/post/hooks";
import {
  POST_STATUS,
  type PostStatus,
  type UserPost,
} from "@/src/features/post/types/post.type";
import { AppBackButton, AppChipsRow, AppLoader } from "@/src/shared/components";
import EmptyList from "@/src/shared/components/ui/EmptyList";
import { colors, metrics, typography } from "@/src/shared/theme";
import { Stack } from "expo-router";
import { PackageIcon } from "phosphor-react-native";
import React, { useMemo, useState } from "react";
import { FlatList, Pressable, Text, TextStyle, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type UserPostFilter = "all" | PostStatus;

const STATUS_TABS: { key: UserPostFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: POST_STATUS.ACTIVE, label: POST_STATUS.ACTIVE },
  { key: POST_STATUS.RETURNED, label: POST_STATUS.RETURNED },
  { key: POST_STATUS.ARCHIVED, label: POST_STATUS.ARCHIVED },
  { key: POST_STATUS.EXPIRED, label: POST_STATUS.EXPIRED },
];

const EMPTY_STATE_COPY: Record<
  UserPostFilter,
  { title: string; subtitle: string }
> = {
  all: {
    title: "No Posts Yet",
    subtitle: "Your posts will appear here once you create them.",
  },
  [POST_STATUS.ACTIVE]: {
    title: "No Active Posts",
    subtitle: "Your active posts will appear here.",
  },
  [POST_STATUS.RETURNED]: {
    title: "No Returned Posts",
    subtitle: "Your returned posts will appear here.",
  },
  [POST_STATUS.ARCHIVED]: {
    title: "No Archived Posts",
    subtitle: "Your archived posts will appear here.",
  },
  [POST_STATUS.EXPIRED]: {
    title: "No Expired Posts",
    subtitle: "Your expired posts will appear here.",
  },
};

const UserPostScreen = () => {
  const inset = useSafeAreaInsets();
  const [selectedTab, setSelectedTab] = useState<UserPostFilter>("all");
  const {
    data: posts,
    isLoading,
    isRefetching,
    error,
    refetch,
  } = useGetAllMyPost();

  const filteredPosts = useMemo<UserPost[]>(
    () =>
      selectedTab === "all"
        ? posts
        : posts.filter((item) => item.status === selectedTab),
    [posts, selectedTab],
  );

  const renderPostList = () => {
    const emptyState = EMPTY_STATE_COPY[selectedTab];

    return (
      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        className="flex-1 bg-surface"
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: metrics.spacing.md,
          paddingVertical: metrics.spacing.md,
          paddingBottom: Math.max(inset.bottom, metrics.spacing.md),
        }}
        onRefresh={() => {
          void refetch();
        }}
        refreshing={isRefetching}
        ItemSeparatorComponent={() => <View className="mt-md" />}
        renderItem={({ item }) => <MyPostCard item={item} />}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center">
            <EmptyList
              icon={
                <PackageIcon
                  size={128}
                  weight="light"
                  color={colors.secondary}
                />
              }
              title={emptyState.title}
              subtitle={emptyState.subtitle}
            />
          </View>
        }
      />
    );
  };

  const renderBody = () => {
    if (isLoading) {
      return (
        <View className="flex-1 bg-surface items-center justify-center">
          <AppLoader />
        </View>
      );
    }

    if (error) {
      return (
        <View className="flex-1 bg-surface items-center justify-center px-lg">
          <Text className="text-textSecondary text-center">
            Unable to load posts
          </Text>
          <Pressable
            onPress={() => refetch()}
            className="mt-md px-lg py-sm bg-secondary rounded-full"
          >
            <Text className="text-white font-semibold">Try again</Text>
          </Pressable>
        </View>
      );
    }

    return <View className="flex-1 bg-surface">{renderPostList()}</View>;
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "My Posts",
          headerLeft: () => (
            <AppBackButton type="arrowLeftIcon" showBackground={false} />
          ),
          headerShadowVisible: false,
          headerTitleStyle: {
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeight.normal as TextStyle["fontWeight"],
          },
        }}
      />

      <View className="bg-surface py-sm flex-row items-center justify-evenly px-lg">
        <AppChipsRow
          chips={STATUS_TABS.map(({ key, label }) => ({
            label,
            selected: selectedTab === key,
            onPress: () => setSelectedTab(key),
          }))}
        />
      </View>

      {renderBody()}
    </>
  );
};

export default UserPostScreen;
