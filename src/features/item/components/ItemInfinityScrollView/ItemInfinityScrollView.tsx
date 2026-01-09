import React, { useCallback } from 'react';
import { FlatList, Text } from 'react-native';
import useItems from '../../hooks/useItems';
import ItemCard from '../ItemCard.tsx/ItemCard';

const ItemInfinityScrollView = () => {
  const {
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
  } = useItems({
    pageSize: 10
  });

  const handleEndReached = useCallback(() => {
    if (!hasNextPage) return;
    if (isFetchingNextPage) return;
    fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleFooter = useCallback(() => {
    if (isFetching || isFetchingNextPage) return <Text>Loading...</Text>;
    if (!hasNextPage) return <Text style={{ textAlign: 'center', padding: 16 }}>No more to load!</Text>;
    return null;
  }, [isFetchingNextPage, hasNextPage, isFetching]);

  return (
    <FlatList
      data={data?.pages.flatMap(page => page.items) || []}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <ItemCard item={item} />}
      onEndReachedThreshold={0.5}
      onEndReached={handleEndReached}
      ListFooterComponent={handleFooter}
    />
  )
}

export default ItemInfinityScrollView
