import { EndOfFeedFooter, Loader } from '@/src/shared/components';
import { useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useEffect } from 'react';
import { FlatList, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { PostCard } from '.';
import { POSTS_QUERY_KEY } from '../constants';
import { usePosts } from '../hooks';
import { PostFilters } from '../types';

type Props = {
  filters: PostFilters;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  scrollEventThrottle?: number;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
};

const PostInfinityScrollView = ({
  filters,
  onScroll,
  scrollEventThrottle = 16,
  ListHeaderComponent
}: Props) => {
  const {
    items,
    hasMore,
    loadMore,
    isLoading,
    isLoadingNextPage,
  } = usePosts({
    filters: filters,
  });
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEY });
  }, [filters, queryClient]);

  const handleEndReached = useCallback(() => {
    if (!hasMore) return;
    setTimeout(() => {
      loadMore();
    }, 3000);
  }, [hasMore, loadMore]);

  const handleFooter = useCallback(() => {
    if (isLoading || isLoadingNextPage) return <Loader />;
    if (!hasMore) return <EndOfFeedFooter />;
    return null;
  }, [isLoadingNextPage, hasMore, isLoading]);

  return (
    <FlatList
      data={items}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <PostCard item={item} />}
      onEndReachedThreshold={0.01}
      onEndReached={handleEndReached}
      ListFooterComponent={handleFooter}
      ListHeaderComponent={ListHeaderComponent}
      onScroll={onScroll}
      scrollEventThrottle={scrollEventThrottle}
    />
  );
};

export default PostInfinityScrollView;
