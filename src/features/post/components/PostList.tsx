import { PostCard } from "@/src/features/post/components/PostCard";
import { POSTS_QUERY_KEY } from "@/src/features/post/constants";
import { usePosts } from "@/src/features/post/hooks";
import type { PostFilters } from "@/src/features/post/types";
import { metrics } from "@/src/shared/theme";
import { useQueryClient } from "@tanstack/react-query";
import React, { useCallback, useMemo, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type PostListProps = {
  direction?: "vertical" | "horizontal";
  filters?: PostFilters;
};

export const PostList = ({
  direction = "vertical",
  filters = {},
}: PostListProps) => {
  const { bottom } = useSafeAreaInsets();
  const isHorizontal = direction === "horizontal";
  const queryClient = useQueryClient();
  const { items, hasMore, loadMore, isLoading, isLoadingNextPage } = usePosts({
    filters,
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleEndReached = useCallback(() => {
    if (!hasMore || isLoadingNextPage) return;
    loadMore();
  }, [hasMore, isLoadingNextPage, loadMore]);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEY });
    setIsRefreshing(false);
  }, [queryClient]);

  const ItemSeparatorComponent = useCallback(
    () => <View style={isHorizontal ? { width: 8 } : { height: 8 }} />,
    [isHorizontal],
  );

  const refreshControl = useMemo(() => {
    if (isHorizontal) return undefined;
    return <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />;
  }, [isHorizontal, isRefreshing, onRefresh]);

  const renderItem = useCallback(
    ({ item }: { item: (typeof items)[number] }) => (
      <PostCard item={item} isFetching={isLoading} type={direction} />
    ),
    [isLoading, direction],
  );

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      ItemSeparatorComponent={ItemSeparatorComponent}
      onEndReachedThreshold={0.1}
      onEndReached={handleEndReached}
      scrollEventThrottle={16}
      bounces
      horizontal={isHorizontal}
      directionalLockEnabled={isHorizontal}
      alwaysBounceVertical={!isHorizontal}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={
        isHorizontal
          ? undefined
          : { padding: 8, paddingBottom: bottom + metrics.tabBar.height }
      }
      refreshControl={refreshControl}
    />
  );
};
