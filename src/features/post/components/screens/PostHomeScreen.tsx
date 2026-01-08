import { PostCard } from '@/src/features/post/components';
import { POSTS_QUERY_KEY } from '@/src/features/post/constants';
import { usePosts } from '@/src/features/post/hooks';
import { AppEndOfFeed, AppLoader } from '@/src/shared/components';
import { useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';

const PostHomeScreen = () => {
  const queryClient = useQueryClient();
  const { items, hasMore, loadMore, isLoading, isLoadingNextPage } = usePosts({ filters: {} });
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
    console.log("Refreshing posts...");
    queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEY });
    setTimeout(() => {
      setIsRefreshing(false);
      console.log("Finished refreshing posts.");
    }, 2000);
  }, [queryClient]);

  const renderFooter = useCallback(() => {
    if (isLoadingNextPage) return (
      <View>
        <AppLoader />
      </View>
    );

    if (!hasMore) return (
      <View>
        <View>
          <AppEndOfFeed />
        </View>
      </View>
    );

    return null;
  }, [isLoadingNextPage, hasMore, isLoading]);

  return (
    <FlatList
      data={items}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <PostCard item={item} isFetching={isLoading} />}
      onEndReachedThreshold={0.01}
      onEndReached={handleEndReached}
      ListFooterComponent={renderFooter}
      scrollEventThrottle={16}
      bounces={true}
      refreshControl={<RefreshControl
        refreshing={isRefreshing}
        onRefresh={onRefresh}
      />}
    />

  );
};

export default PostHomeScreen;
