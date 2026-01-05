import { AppEndOfFeed, AppLoader } from '@/src/shared/components';
import { useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, NativeScrollEvent, NativeSyntheticEvent, RefreshControl, View } from 'react-native';
import { PostCard } from '.';
import { POSTS_QUERY_KEY } from '../constants';
import { usePosts } from '../hooks';

const PostHomeScreen = () => {
  const queryClient = useQueryClient();
  const { items, hasMore, loadMore, isLoading, isLoadingNextPage } = usePosts({ filters: {} });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const isEndOfFeedRef = useRef(false);
  const currentOffset = useRef(0);
  const isScrollingDownRef = useRef(false);

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
    if (isLoading || isLoadingNextPage) return (
      <View className="border-2">
        <AppLoader />
      </View>
    );

    if (!hasMore) return (
      <View className="border-2">
        <AppEndOfFeed />
      </View>
    );

    return null;
  }, [isLoadingNextPage, hasMore, isLoading]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const direction = event.nativeEvent.contentOffset.y > currentOffset.current ? 'down' : 'up';
    currentOffset.current = event.nativeEvent.contentOffset.y;
    isScrollingDownRef.current = direction === 'down';
    console.log(`Scrolling ${direction}`);
  };

  return (
    <FlatList
      data={items}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <PostCard item={item} isFetching={isLoading} />}
      onEndReachedThreshold={0.01}
      onEndReached={handleEndReached}
      ListFooterComponent={renderFooter}
      onScroll={handleScroll}
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
