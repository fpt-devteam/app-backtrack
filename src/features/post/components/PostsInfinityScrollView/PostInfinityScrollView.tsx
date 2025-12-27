import { useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useEffect } from 'react';
import { FlatList, Text } from 'react-native';
import { PostCard } from '..';
import { POSTS_QUERY_KEY } from '../../constants';
import { usePosts } from '../../hooks';
import { PostFilters } from '../../types';

type Props = {
  filters: PostFilters;
};

export const PostInfinityScrollView = ({ filters }: Props) => {
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
    console.log('Filters changed in Infinity Scroll View: ', filters);
    queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEY });
  }, [filters, queryClient]);

  const handleEndReached = useCallback(() => {
    if (!hasMore) return;
    loadMore();
  }, [hasMore, loadMore]);

  const handleFooter = useCallback(() => {
    if (isLoading || isLoadingNextPage) return <Text>Loading...</Text>;
    if (!hasMore) return <Text style={{ textAlign: 'center', padding: 16 }}>No more to load!</Text>;
    return null;
  }, [isLoadingNextPage, hasMore, isLoading]);

  return (
    <FlatList
      data={items}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <PostCard item={item} />}
      onEndReachedThreshold={0.5}
      onEndReached={handleEndReached}
      ListFooterComponent={handleFooter}
    />
  );
}
