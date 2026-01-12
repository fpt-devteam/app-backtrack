import { MinimalPostCard } from "@/src/features/post/components";
import { LocationSearchBar } from "@/src/features/post/components/ui";
import { usePosts } from "@/src/features/post/hooks";
import type { PostFilters } from "@/src/features/post/types";
import { PostType } from "@/src/features/post/types";
import { AppEndOfFeed, AppLoader } from "@/src/shared/components";
import { POST_ROUTE } from "@/src/shared/constants";
import { colors } from "@/src/shared/theme";
import type { LocationFilterValue } from "@/src/shared/types";
import { router, useLocalSearchParams } from "expo-router";
import {
  ArrowLeftIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
} from "phosphor-react-native";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FlatList, Pressable, ScrollView, Text, View } from "react-native";

const isLocationFilterValue = (value: unknown): value is LocationFilterValue => {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.lat === "number" &&
    typeof record.lng === "number" &&
    typeof record.radius === "number" &&
    (record.label === undefined || typeof record.label === "string") &&
    (record.placeId === undefined || typeof record.placeId === "string")
  );
};

const parseLocationFilter = (raw?: string): LocationFilterValue | null => {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    return isLocationFilterValue(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

export default function PostSearchResultScreen() {
  const { termSearch, locationFilter } = useLocalSearchParams<{
    termSearch?: string;
    locationFilter?: string;
  }>();

  const searchTermData = (termSearch ?? "").toString();
  const parsedLocationFilter = useMemo(
    () => parseLocationFilter(locationFilter),
    [locationFilter]
  );

  const isEndOfFeedRef = useRef(false);

  const [selectedPostType, setSelectedPostType] = useState<PostType | "All">(
    "All"
  );

  const [filters, setFilters] = useState<PostFilters>({
    searchTerm: searchTermData || undefined,
    location: parsedLocationFilter
      ? {
        latitude: parsedLocationFilter.lat,
        longitude: parsedLocationFilter.lng,
      }
      : undefined,
    radiusInKm: parsedLocationFilter?.radius,
  });

  const { items, isLoading, hasMore, loadMore, isLoadingNextPage } = usePosts({
    filters,
  });

  useEffect(() => {
    isEndOfFeedRef.current = !hasMore;
  }, [hasMore]);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      searchTerm: searchTermData || undefined,
      location: parsedLocationFilter
        ? {
          latitude: parsedLocationFilter.lat,
          longitude: parsedLocationFilter.lng,
        }
        : undefined,
      radiusInKm: parsedLocationFilter?.radius,
    }));
  }, [parsedLocationFilter, searchTermData]);

  const handleEndReached = useCallback(() => {
    if (!hasMore) return;
    setTimeout(() => {
      loadMore();
    }, 3000);
  }, [hasMore, loadMore]);

  const handleSearchBarPress = () => {
    router.push({
      pathname: POST_ROUTE.search,
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

  const renderFooter = useCallback(() => {
    if (isLoading || isLoadingNextPage)
      return (
        <View className="mt-4">
          <AppLoader />
        </View>
      );

    if (!hasMore)
      return (
        <View className="mt-4">
          <AppEndOfFeed />
        </View>
      );

    return null;
  }, [isLoadingNextPage, hasMore, isLoading]);

  const locationLabel = useMemo(() => {
    if (!parsedLocationFilter) return undefined;
    const baseLabel = parsedLocationFilter.label ?? "Selected location";
    return `${baseLabel} - ${parsedLocationFilter.radius} km`;
  }, [parsedLocationFilter]);

  return (
    <View className="bg-white flex-1">
      <View className="p-4 pb-2">
        <View className="flex-row items-center">
          <Pressable
            onPress={() => router.replace(POST_ROUTE.search)}
            hitSlop={10}
            className="mr-2 h-12 w-12 items-center justify-center rounded-2xl border-2"
            style={{ borderColor: colors.slate[200] }}
          >
            <ArrowLeftIcon size={20} color={colors.slate[700]} />
          </Pressable>

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

        <LocationSearchBar
          valueLabel={locationLabel}
          locationFilter={parsedLocationFilter}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-3"
          contentContainerStyle={{ paddingHorizontal: 2 }}
        >
          <View
            className="mr-2 h-9 px-3 rounded-full items-center justify-center flex-row"
            style={{ backgroundColor: colors.sky[50] }}
          >
            <FunnelIcon size={16} color={colors.blue[600]} weight="bold" />
          </View>

          <Pressable
            onPress={() => handlePostTypeChange("All")}
            className="mr-2 h-9 px-4 rounded-full items-center justify-center"
            style={{
              backgroundColor:
                selectedPostType === "All"
                  ? colors.blue[500]
                  : colors.slate[100],
            }}
          >
            <Text
              className="text-sm font-semibold"
              style={{
                color:
                  selectedPostType === "All" ? "#fff" : colors.slate[700],
              }}
            >
              All
            </Text>
          </Pressable>

          <Pressable
            onPress={() => handlePostTypeChange(PostType.Lost)}
            className="mr-2 h-9 px-4 rounded-full items-center justify-center"
            style={{
              backgroundColor:
                selectedPostType === PostType.Lost
                  ? colors.blue[500]
                  : colors.slate[100],
            }}
          >
            <Text
              className="text-sm font-semibold"
              style={{
                color:
                  selectedPostType === PostType.Lost ? "#fff" : colors.slate[700],
              }}
            >
              Lost
            </Text>
          </Pressable>

          <Pressable
            onPress={() => handlePostTypeChange(PostType.Found)}
            className="mr-2 h-9 px-4 rounded-full items-center justify-center"
            style={{
              backgroundColor:
                selectedPostType === PostType.Found
                  ? colors.blue[500]
                  : colors.slate[100],
            }}
          >
            <Text
              className="text-sm font-semibold"
              style={{
                color:
                  selectedPostType === PostType.Found
                    ? "#fff"
                    : colors.slate[700],
              }}
            >
              Found
            </Text>
          </Pressable>
        </ScrollView>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MinimalPostCard post={item} />}
        onEndReached={handleEndReached}
        scrollEventThrottle={16}
        ListFooterComponent={renderFooter}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </View>
  );
}
