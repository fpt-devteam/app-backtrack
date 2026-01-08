import { MinimalPostCard, PostFiltersComponent } from "@/src/features/post/components";
import { usePosts } from "@/src/features/post/hooks";
import { PostFilters } from "@/src/features/post/types";
import { AppEndOfFeed, AppLoader } from "@/src/shared/components";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, View } from "react-native";

export default function PostSearchResultScreen() {
  const { searchTerm } = useLocalSearchParams<{ searchTerm?: string }>();
  const searchTermData = (searchTerm ?? "").toString();
  const isEndOfFeedRef = useRef(false);

  const [filters, setFilters] = useState<PostFilters>({ searchTerm: searchTermData });
  const { items, isLoading, hasMore, loadMore, isLoadingNextPage } = usePosts({ filters });

  useEffect(() => {
    isEndOfFeedRef.current = !hasMore;
  }, [hasMore]);

  const handleEndReached = useCallback(() => {
    if (!hasMore) return;
    setTimeout(() => {
      loadMore();
    }, 3000);
  }, [hasMore, loadMore]);

  const renderFooter = useCallback(() => {
    if (isLoading || isLoadingNextPage) return (
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
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <MinimalPostCard post={item} />}
      onEndReached={handleEndReached}
      scrollEventThrottle={16}
      ListHeaderComponent={<PostFiltersComponent filters={filters} onFiltersChange={setFilters} />}
      ListFooterComponent={renderFooter}
      contentContainerStyle={{ padding: 16 }}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
    />
  );
}
