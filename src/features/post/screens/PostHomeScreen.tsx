import { PostCard } from "@/src/features/post/components";
import { POSTS_QUERY_KEY } from "@/src/features/post/constants";
import { usePosts } from "@/src/features/post/hooks";
import type { PostFilters } from "@/src/features/post/types";
import { AppEndOfFeed, AppLoader } from "@/src/shared/components";
import { useQueryClient } from "@tanstack/react-query";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";

type PostHomeScreenProps = {
  direction?: "vertical" | "horizontal";
  filters?: PostFilters;
};

export const PostHomeScreen = ({
  direction = "vertical",
  filters = {},
}: PostHomeScreenProps) => {
  const queryClient = useQueryClient();
  const { items, hasMore, loadMore, isLoading, isLoadingNextPage } = usePosts({
    filters,
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const isEndOfFeedRef = useRef(false);

  const handleEndReached = useCallback(() => {
    if (!hasMore) return;
    setTimeout(() => {
      loadMore();
    }, 3000);
  }, [hasMore, loadMore]);

  useEffect(() => {
    isEndOfFeedRef.current = !hasMore;
  }, [hasMore]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEY });
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  }, [queryClient]);

  const renderFooter = useCallback(() => {
    if (isLoadingNextPage) return <AppLoader />;

    if (!hasMore) {
      return <AppEndOfFeed hint="No more posts" />;
    }

    return null;
  }, [isLoadingNextPage, hasMore, isLoading]);

  if (direction === "vertical") {
    return (
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard item={item} isFetching={isLoading} type={direction} />
        )}
        onEndReachedThreshold={0.01}
        onEndReached={handleEndReached}
        ListFooterComponent={renderFooter}
        scrollEventThrottle={16}
        bounces={true}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      />
    );
  } else {
    return (
      <FlatList
        horizontal
        directionalLockEnabled
        alwaysBounceVertical={false}
        bounces={true}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard item={item} isFetching={isLoading} type={direction} />
        )}
        ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
        onEndReachedThreshold={0.01}
        onEndReached={handleEndReached}
        ListFooterComponent={renderFooter}
        scrollEventThrottle={16}
      />
    );
  }
};
