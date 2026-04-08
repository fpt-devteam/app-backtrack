import { LocationField } from "@/src/features/map/components";
import { useLocationSelectionStore } from "@/src/features/map/store";
import type { UserLocation } from "@/src/features/map/types";
import { PostCard } from "@/src/features/post/components";
import { useSearchPost } from "@/src/features/post/hooks";
import { usePostSearchStore } from "@/src/features/post/hooks/usePostSearchStore";
import { PostType } from "@/src/features/post/types";
import {
  POST_SEARCH_MODE,
  type PostSearchOptions,
} from "@/src/features/post/types/post.type";
import {
  AppSegmentedControl,
  TouchableIconButton,
} from "@/src/shared/components";
import { POST_ROUTE } from "@/src/shared/constants";
import { colors } from "@/src/shared/theme";
import { Nullable } from "@/src/shared/types";
import { router } from "expo-router";
import { MotiView } from "moti";

import {
  ArrowLeftIcon,
  FunnelSimpleIcon,
  MagnifyingGlassIcon,
} from "phosphor-react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import {
  FlatList,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const POST_SEARCH_TAB = {
  SEMANTIC: "Semantic",
  KEYWORD: "Keyword",
  LATEST: "Latest",
  NEARBY: "Nearby",
};

type PostSearchTab = (typeof POST_SEARCH_TAB)[keyof typeof POST_SEARCH_TAB];

const POST_TYPE_OPTION = {
  ALL: "All",
  LOST: "Lost",
  FOUND: "Found",
};

type PostTypeOption = (typeof POST_TYPE_OPTION)[keyof typeof POST_TYPE_OPTION];

const POST_TYPE_OPTIONS: { label: string; value: PostTypeOption }[] = [
  { label: "All", value: POST_TYPE_OPTION.ALL },
  { label: "Lost", value: POST_TYPE_OPTION.LOST },
  { label: "Found", value: POST_TYPE_OPTION.FOUND },
];

const RADIUS_OPTIONS: { label: string; value: string }[] = [
  { label: "1 km", value: "1" },
  { label: "5 km", value: "5" },
  { label: "10 km", value: "10" },
  { label: "20 km", value: "20" },
];

const TABS: { key: PostSearchTab; label: string }[] = [
  { key: POST_SEARCH_TAB.SEMANTIC, label: "Semantic" },
  { key: POST_SEARCH_TAB.KEYWORD, label: "Keyword" },
  { key: POST_SEARCH_TAB.LATEST, label: "Latest" },
  { key: POST_SEARCH_TAB.NEARBY, label: "Nearby" },
];

type FilterDraft = {
  location: UserLocation;
  postType: PostTypeOption;
  radius: string;
};

type FilterAction =
  | { type: "SET_LOCATION"; payload: UserLocation }
  | { type: "SET_POST_TYPE"; payload: PostTypeOption }
  | { type: "SET_RADIUS"; payload: string }
  | { type: "RESET"; payload: FilterDraft };

function filterReducer(state: FilterDraft, action: FilterAction): FilterDraft {
  switch (action.type) {
    case "SET_LOCATION":
      return { ...state, location: action.payload };
    case "SET_POST_TYPE":
      return { ...state, postType: action.payload };
    case "SET_RADIUS":
      return { ...state, radius: action.payload };
    case "RESET":
      return action.payload;
  }
}

function buildSearchOptions(
  termSearch: string,
  tab: PostSearchTab,
  filter: FilterDraft,
): PostSearchOptions {
  const mode =
    tab === POST_SEARCH_TAB.SEMANTIC
      ? POST_SEARCH_MODE.SEMANTIC
      : POST_SEARCH_MODE.KEYWORD;

  return {
    query: termSearch,
    mode,
    filters: {
      location: filter.location.location,
      radiusInKm: Number(filter.radius),
      postType:
        filter.postType === POST_TYPE_OPTION.ALL
          ? undefined
          : (filter.postType as PostType),
    },
  };
}

export default function PostSearchResultScreen() {
  const insets = useSafeAreaInsets();
  const { confirmedSelection } = useLocationSelectionStore();
  const keyword = usePostSearchStore((state) => state.keyword.value);
  const locationAddress = usePostSearchStore((state) => state.location.address);
  const locationCoords = usePostSearchStore((state) => state.location.coords);
  const radiusInKm = usePostSearchStore((state) => state.location.radius);

  const [tab, setTab] = useState<PostSearchTab>(TABS[0].key);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const normalizedSearchTerm = (keyword ?? "").trim();
  const safeRadiusInKm = radiusInKm ?? 20;

  const storedLocation = useMemo<UserLocation | null>(() => {
    if (!locationCoords) return null;

    return {
      location: locationCoords,
      displayAddress: locationAddress ?? null,
      externalPlaceId: null,
      radiusInKm: safeRadiusInKm,
    };
  }, [locationAddress, locationCoords, safeRadiusInKm]);

  const resolvedLocation = useMemo<UserLocation | null>(
    () => storedLocation ?? confirmedSelection ?? null,
    [confirmedSelection, storedLocation],
  );

  const initialFilter = useMemo<FilterDraft>(
    () => ({
      location:
        resolvedLocation ??
        ({
          location: { latitude: 0, longitude: 0 },
          displayAddress: null,
          externalPlaceId: null,
          radiusInKm: safeRadiusInKm,
        } as UserLocation),
      postType: POST_TYPE_OPTION.ALL,
      radius: String(safeRadiusInKm),
    }),
    [resolvedLocation, safeRadiusInKm],
  );

  const [filterDraft, dispatch] = useReducer(filterReducer, initialFilter);
  const [appliedFilter, setAppliedFilter] =
    useState<FilterDraft>(initialFilter);

  useEffect(() => {
    dispatch({ type: "RESET", payload: initialFilter });
    setAppliedFilter(initialFilter);
  }, [initialFilter]);

  const searchOptions = useMemo<Nullable<PostSearchOptions>>(() => {
    if (!normalizedSearchTerm || !appliedFilter.location.location) return null;
    return buildSearchOptions(normalizedSearchTerm, tab, appliedFilter);
  }, [appliedFilter, normalizedSearchTerm, tab]);

  const { items } = useSearchPost({ options: searchOptions });

  const postList = useMemo(() => {
    const sortedItems = [...items];
    if (tab === POST_SEARCH_TAB.LATEST) {
      // Logic for latest posts
    } else if (tab === POST_SEARCH_TAB.NEARBY) {
      // Logic for nearby posts
    }
    return sortedItems;
  }, [items, tab]);

  const handleApplyFilter = () => {
    setAppliedFilter({ ...filterDraft });
    setShowOptions(false);
  };

  const handleResetFilter = () => {
    dispatch({ type: "RESET", payload: initialFilter });
  };

  const handleLocationChange = useCallback((loc: UserLocation) => {
    dispatch({ type: "SET_LOCATION", payload: loc });
  }, []);

  const handlePostTypeChange = useCallback((val: string) => {
    dispatch({ type: "SET_POST_TYPE", payload: val as PostTypeOption });
  }, []);

  const handleRadiusChange = useCallback((val: string) => {
    dispatch({ type: "SET_RADIUS", payload: val });
  }, []);

  useEffect(() => {
    if (normalizedSearchTerm && resolvedLocation?.location) return;
    router.replace(POST_ROUTE.search);
  }, [normalizedSearchTerm, resolvedLocation]);

  if (!normalizedSearchTerm || !resolvedLocation?.location) {
    return null;
  }

  return (
    <View className="bg-surface flex-1" style={{ paddingTop: 2 * insets.top }}>
      <View
        className="absolute inset-0"
        style={{ paddingTop: insets.top, zIndex: 10 }}
        pointerEvents="box-none"
      >
        {/* Top row: Back + Search bar */}
        <View
          className="flex-row items-center gap-4 px-4 pb-2 bg-surface"
          style={{
            borderBottomColor: colors.gray[100],
            borderBottomWidth: 4,
            paddingBottom: 8,
          }}
        >
          <TouchableIconButton
            onPress={() => router.back()}
            icon={
              <ArrowLeftIcon size={24} color={colors.primary} weight="bold" />
            }
          />

          <View
            className="flex-1 flex-row items-center rounded-lg gap-4 overflow-hidden"
            style={{ borderColor: colors.primary, borderWidth: 2 }}
          >
            <TextInput
              value={keyword ?? ""}
              returnKeyType="search"
              onFocus={() => router.back()}
              className="flex-1 text-sm px-3 py-1"
              placeholderTextColor={colors.slate[400]}
            />
            <View
              className="px-3 py-1"
              style={{ backgroundColor: colors.primary }}
            >
              <MagnifyingGlassIcon size={24} color={colors.white} />
            </View>
          </View>

          <TouchableIconButton
            onPress={() => setShowOptions(!showOptions)}
            icon={
              <FunnelSimpleIcon
                size={24}
                color={colors.primary}
                weight="bold"
              />
            }
          />
        </View>

        {/* Filter Options Top Sheet*/}
        <MotiView
          className="flex-1"
          pointerEvents={showOptions ? "auto" : "none"}
          animate={{ opacity: showOptions ? 1 : 0 }}
          transition={{ type: "timing", duration: 200 }}
        >
          <MotiView
            className="bg-surface px-4 pt-3 pb-4 gap-4 border-b"
            animate={{
              opacity: showOptions ? 1 : 0,
              translateY: showOptions ? 0 : -16,
            }}
            transition={{ type: "timing", duration: 220 }}
            style={{ borderBottomColor: colors.gray[200] }}
          >
            {/* Location Options */}
            <View>
              <LocationField
                value={filterDraft.location}
                onChange={handleLocationChange}
              />
            </View>

            {/* Post Type Options */}
            <View className="flex-row items-center justify-between gap-4">
              <Text className="text-xs">Post Type</Text>

              <View className="flex-1">
                <AppSegmentedControl
                  value={filterDraft.postType}
                  onChange={handlePostTypeChange}
                  options={POST_TYPE_OPTIONS}
                />
              </View>
            </View>

            {/* Radius Options */}
            <View className="flex-row items-center justify-between gap-4">
              <Text className="text-xs">Radius</Text>

              <View className="flex-1">
                <AppSegmentedControl
                  value={filterDraft.radius}
                  onChange={handleRadiusChange}
                  options={RADIUS_OPTIONS}
                />
              </View>
            </View>

            {/* Button container include: Reset filter, apply filter */}
            <View className="flex-row gap-3 mt-4">
              <TouchableOpacity
                onPress={handleResetFilter}
                className="flex-1 py-2.5 rounded-xl border items-center justify-center"
                style={{ borderColor: colors.primary }}
              >
                <Text
                  style={{
                    color: colors.primary,
                    fontSize: 14,
                    fontWeight: "600",
                  }}
                >
                  Reset
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleApplyFilter}
                className="flex-1 py-2.5 rounded-xl items-center justify-center"
                style={{ backgroundColor: colors.primary }}
              >
                <Text
                  style={{
                    color: colors.white,
                    fontSize: 14,
                    fontWeight: "600",
                  }}
                >
                  Apply
                </Text>
              </TouchableOpacity>
            </View>
          </MotiView>

          {/* Overlay */}
          <Pressable
            onPress={() => setShowOptions(false)}
            className="flex-1 bg-slate-900/20"
          />
        </MotiView>
      </View>

      {/* Tab Bar Container */}
      <View
        className="flex-row w-full bg-surface"
        style={{
          borderBottomWidth: 1,
          borderBottomColor: colors.gray[200],
        }}
      >
        {TABS.map(({ key, label }) => {
          const active = tab === key;
          return (
            <Pressable
              key={key}
              onPress={() => setTab(key)}
              className="flex-1 items-center justify-center relative py-3"
              style={{
                borderBottomWidth: 1,
                borderBottomColor: active ? colors.primary : "transparent",
              }}
            >
              <Text
                className={`${active ? "font-bold" : "font-medium"} w-full text-center`}
                style={{
                  fontSize: 10,
                  color: active ? colors.primary : colors.slate[500],
                  borderRightColor: colors.gray[200],
                  borderRightWidth: key === POST_SEARCH_TAB.NEARBY ? 0 : 1,
                }}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Result List */}
      <FlatList
        data={postList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostCard item={item} />}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "center",
          gap: 12,
          marginBottom: 12,
        }}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
