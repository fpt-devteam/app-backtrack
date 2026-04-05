import { useLocationSelectionStore } from "@/src/features/map/store";
import { PostCard } from "@/src/features/post/components/PostCard";
import { usePosts } from "@/src/features/post/hooks";
import type { Post, PostFilters } from "@/src/features/post/types";
import { AppLoader } from "@/src/shared/components";
import React, { useCallback, useMemo } from "react";
import { FlatList, RefreshControl, View } from "react-native";

type PostListProps = {
  direction?: "vertical" | "horizontal";
  filters?: PostFilters;
};

export const PostList = ({
  direction = "vertical",
  filters,
}: PostListProps) => {
  const { confirmedSelection } = useLocationSelectionStore();

  const { items, isLoading, refetch, isRefetching } = usePosts({
    enabled: !!confirmedSelection,
    filters: {
      postType: filters?.postType,
      searchTerm: filters?.searchTerm,
      radiusInKm: confirmedSelection?.radiusInKm,
      location: {
        latitude: confirmedSelection?.location.latitude!,
        longitude: confirmedSelection?.location.longitude!,
      },
    },
  });

  const isHorizontal = direction === "horizontal";

  const refreshControl = useMemo(() => {
    if (isHorizontal) return undefined;
    return <RefreshControl refreshing={isRefetching} onRefresh={refetch} />;
  }, [isHorizontal, isRefetching, refetch]);

  const renderItem = useCallback(
    ({ item }: { item: Post }) => <PostCard item={item} />,
    [],
  );

  const renderSeparator = useCallback(
    () => <View style={isHorizontal ? { width: 12 } : { height: 12 }} />,
    [isHorizontal],
  );

  const renderFooter = useCallback(() => {
    if (!isLoading || items.length === 0) return null;
    return <AppLoader />;
  }, [isLoading, items.length]);

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      ItemSeparatorComponent={renderSeparator}
      ListFooterComponent={renderFooter}
      scrollEventThrottle={16}
      bounces
      horizontal={isHorizontal}
      directionalLockEnabled={isHorizontal}
      alwaysBounceVertical={!isHorizontal}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      refreshControl={refreshControl}
      numColumns={isHorizontal ? undefined : 2}
      columnWrapperStyle={
        isHorizontal ? undefined : { justifyContent: "space-between" }
      }
    />
  );
};
