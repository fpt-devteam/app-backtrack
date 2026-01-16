import { useLocationSelectionStore } from "@/src/features/location/store";
import type { UserLocation } from "@/src/features/location/types";
import { MinimalPostCard } from "@/src/features/post/components/cards";
import { usePosts } from "@/src/features/post/hooks";
import type { PostFilters } from "@/src/features/post/types";
import { PostType } from "@/src/features/post/types";
import { AppEndOfFeed, AppLoader, ChipsRow } from "@/src/shared/components";
import { POST_ROUTE } from "@/src/shared/constants";
import { colors } from "@/src/shared/theme";
import type { LocationFilterValue } from "@/src/shared/types";
import { yupResolver } from "@hookform/resolvers/yup";
import type { ExternalPathString, RelativePathString } from "expo-router";
import { router, useLocalSearchParams } from "expo-router";
import {
  ArrowLeftIcon,
  MagnifyingGlassIcon
} from "phosphor-react-native";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FlatList, Pressable, Text, View } from "react-native";

import * as yup from "yup";
const filterSchema = yup
  .object({
    detailLocation: yup.mixed<UserLocation>().defined(),
  })
  .required();

type FilterSchema = yup.InferType<typeof filterSchema>;

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
  const { selection } = useLocationSelectionStore();

  const { control, formState: { errors } } = useForm<FilterSchema>({
    defaultValues: {
      detailLocation: undefined,
    },
    resolver: yupResolver(filterSchema),
    mode: "onSubmit",
  });

  const searchTermData = (termSearch ?? "").toString();

  const parsedLocationFilter = useMemo(
    () => parseLocationFilter(locationFilter),
    [locationFilter]
  );

  const isEndOfFeedRef = useRef(false);

  const [selectedPostType, setSelectedPostType] = useState<PostType | "All">("All");

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

  const { items, isLoading, hasMore, loadMore, isLoadingNextPage } = usePosts({ filters });

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

  const handleOnLocationChange = (value: UserLocation) => {
    setFilters((prev) => ({
      ...prev,
      location: {
        latitude: value.location.latitude,
        longitude: value.location.longitude,
      },
      radiusInKm: value?.radiusKm ?? 50,
    }));
    console.log("Filter: ", filters)
  }

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
              { label: 'All', selected: selectedPostType === 'All', onPress: () => handlePostTypeChange('All') },
              { label: 'Found', selected: selectedPostType === PostType.Found, onPress: () => handlePostTypeChange(PostType.Found) },
              { label: 'Lost', selected: selectedPostType === PostType.Lost, onPress: () => handlePostTypeChange(PostType.Lost) },
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
        ListFooterComponent={renderFooter}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </View>
  );
}
