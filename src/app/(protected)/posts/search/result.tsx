import { MinimalPostCard } from "@/src/features/post/components";
import { usePosts } from "@/src/features/post/hooks";
import type { PostFilters } from "@/src/features/post/types";
import { PostType } from "@/src/features/post/types";
import { AppListFooter, ChipsRow } from "@/src/shared/components";
import { POST_ROUTE } from "@/src/shared/constants";
import { colors } from "@/src/shared/theme";
import type { ExternalPathString, RelativePathString } from "expo-router";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeftIcon, MagnifyingGlassIcon } from "phosphor-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";

type PostChipType = PostType | "All";

export default function PostSearchResultScreen() {
  const { termSearch } = useLocalSearchParams<{
    termSearch?: string;
  }>();

  const isEndOfFeedRef = useRef(false);
  const [selectedPostType, setSelectedPostType] = useState<PostChipType>("All");

  const searchTermData = React.useMemo(
    () => (termSearch ?? "").toString(),
    [termSearch],
  );

  const [filters, setFilters] = useState<PostFilters>({
    searchTerm: searchTermData || undefined,
  });

  const {
    items,
    hasMore,
    loadMore,
    isFetchingNextPage: isLoadingNextPage,
  } = usePosts({
    filters,
  });

  useEffect(() => {
    isEndOfFeedRef.current = !hasMore;
  }, [hasMore]);

  useEffect(() => {
    setFilters({
      searchTerm: searchTermData || undefined,
    });
  }, [searchTermData]);

  const handleEndReached = useCallback(() => {
    if (!hasMore) return;
    setTimeout(() => {
      loadMore();
    }, 3000);
  }, [hasMore, loadMore]);

  const handleSearchBarPress = () => {
    router.push({
      pathname: POST_ROUTE.search as ExternalPathString | RelativePathString,
      params: { initialQuery: searchTermData },
    });
  };

  const handlePostTypeChange = (type: PostType | "All") => {
    setSelectedPostType(type);
    setFilters((prev) => ({
      ...prev,
      postType: type === "All" ? undefined : type,
    }));
  };

  return (
    <View className="bg-white flex-1">
      <View className="p-4 pb-2">
        {/* Header */}
        <View className="flex-row items-center">
          {/* Back */}
          <Pressable
            onPress={() => router.back()}
            hitSlop={10}
            className="mr-2 h-12 w-12 items-center justify-center rounded-2xl border-2"
            style={{ borderColor: colors.slate[200] }}
          >
            <ArrowLeftIcon size={20} color={colors.slate[700]} />
          </Pressable>

          {/* SearchBar */}
          <Pressable
            onPress={handleSearchBarPress}
            className="flex-1 flex-row items-center border-2 rounded-2xl px-3 h-12"
            style={{ borderColor: colors.slate[200] }}
          >
            <MagnifyingGlassIcon size={20} color={colors.slate[500]} />
            <Text
              className="flex-1 ml-2 text-base"
              style={{ color: colors.slate[900] }}
              numberOfLines={1}
            >
              {searchTermData || "Search..."}
            </Text>
          </Pressable>
        </View>

        {/* Post Type Filter*/}
        <View className="mt-4">
          <ChipsRow
            chips={[
              {
                label: "All",
                selected: selectedPostType === "All",
                onPress: () => handlePostTypeChange("All"),
              },
              {
                label: "Found",
                selected: selectedPostType === PostType.Found,
                onPress: () => handlePostTypeChange(PostType.Found),
              },
              {
                label: "Lost",
                selected: selectedPostType === PostType.Lost,
                onPress: () => handlePostTypeChange(PostType.Lost),
              },
            ]}
          />
        </View>
      </View>

      {/* Result Posts List */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MinimalPostCard post={item} />}
        onEndReached={handleEndReached}
        scrollEventThrottle={16}
        ListFooterComponent={
          <AppListFooter
            isFetchingNextPage={isLoadingNextPage}
            hasNextPage={!!hasMore}
          />
        }
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </View>
  );
}
