import { ItemPlaceMarker } from "@/src/features/map/components";
import { PostCard } from "@/src/features/post/components";
import { usePostSearchStore, useSearchPost } from "@/src/features/post/hooks";
import {
  locationSearchSchema,
  postOptionSchema,
  radiusSearchSchema,
} from "@/src/features/post/schemas";
import {
  POST_SEARCH_MODE,
  type Post,
  type PostSearchOptions,
} from "@/src/features/post/types";
import { AppBackButton, TouchableIconButton } from "@/src/shared/components";
import { POST_ROUTE } from "@/src/shared/constants";
import { colors } from "@/src/shared/theme";
import BottomSheetPrimitive, {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { router, Stack } from "expo-router";
import { MotiView } from "moti";
import { FadersIcon, ListBulletsIcon } from "phosphor-react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import MapView, {
  Circle,
  Marker,
  type LatLng,
  type Region,
} from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const FALLBACK_COORDINATE: LatLng = {
  latitude: 10.7769,
  longitude: 106.7009,
};

const KM_PER_LAT_DEGREE = 111;
const MIN_MAP_DELTA = 0.01;
const LIST_SNAP_POINTS: (string | number)[] = ["34%", "60%", "90%"];

const buildRegionByRadius = (center: LatLng, radiusInKm: number): Region => {
  const safeRadiusKm = Math.max(radiusInKm, 1);
  const latitudeDelta = Math.max(
    (safeRadiusKm / KM_PER_LAT_DEGREE) * 2.6,
    MIN_MAP_DELTA,
  );

  const cosLatitude = Math.cos((center.latitude * Math.PI) / 180);
  const longitudeDivisor = KM_PER_LAT_DEGREE * Math.max(cosLatitude, 0.2);
  const longitudeDelta = Math.max(
    (safeRadiusKm / longitudeDivisor) * 2.6,
    MIN_MAP_DELTA,
  );

  return {
    latitude: center.latitude,
    longitude: center.longitude,
    latitudeDelta,
    longitudeDelta,
  };
};

const PostSearchResultScreen = () => {
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);

  const sheetRef = useRef<BottomSheetPrimitive>(null);
  const [sheetIndex, setSheetIndex] = useState(-1);

  const hasHydrated = usePostSearchStore.persist.hasHydrated();
  const keyword = usePostSearchStore((state) => state.keyword.value);
  const locationAddress = usePostSearchStore((state) => state.location.address);
  const locationCoords = usePostSearchStore((state) => state.location.coords);
  const locationRadius = usePostSearchStore((state) => state.location.radius);
  const eventDate = usePostSearchStore((state) => state.temporal.date);

  const safeCoords = useMemo(() => {
    if (!locationCoords || !locationSearchSchema.isValidSync(locationCoords)) {
      console.log("Error at coords");
      return locationSearchSchema.getDefault();
    }
    return locationCoords;
  }, [locationCoords]);

  const safeRadius = useMemo(() => {
    if (!locationRadius || !radiusSearchSchema.isValidSync(locationRadius)) {
      console.log("Error at radius");
      return radiusSearchSchema.getDefault();
    }

    return locationRadius;
  }, [locationRadius]);

  const safeEventDate = useMemo(() => {
    if (!eventDate || !postOptionSchema.isValidSync({ eventTime: eventDate }) ) {
      console.log("Error at event date");
      return null;
    }

    const date = new Date(eventDate);
    if (isNaN(date.getTime())) {
      console.log("Error at event date");
      return null;
    }

    return date;
  }, [eventDate]);

  const validSearchOptions = useMemo<PostSearchOptions | null>(() => {
    try {
      const castedOptions = postOptionSchema.cast({
        query: keyword,
        mode: POST_SEARCH_MODE.KEYWORD,
        filters: {
          location: safeCoords,
          radiusInKm: safeRadius,
          eventTime: safeEventDate,
        },
      }) as PostSearchOptions;

      postOptionSchema.validateSync(castedOptions, { abortEarly: true });
      return castedOptions;
    } catch (_error) {
      return null;
    }
  }, [eventDate, keyword, locationCoords, locationRadius]);

  const mapRegion = useMemo(
    () => buildRegionByRadius(safeCoords, safeRadius),
    [safeCoords, safeRadius],
  );

  const {
    error,
    items,
    hasMore,
    loadMore,
    isLoading,
    isFetchingNextPage,
    refetch,
  } = useSearchPost({
    options: validSearchOptions,
    enabled: hasHydrated && !!validSearchOptions,
  });

  const markerItems = useMemo(
    () =>
      items.filter(
        (item) =>
          item.location?.latitude != null && item.location?.longitude != null,
      ),
    [items],
  );

  const keywordSummary = useMemo(() => {
    const safeKeyword = keyword?.trim();
    return safeKeyword && safeKeyword.length > 0 ? safeKeyword : "Anything";
  }, [keyword]);

  const addressSummary = useMemo(() => {
    const safeAddress = locationAddress?.trim();
    if (safeAddress) return safeAddress;
    return "Nearby";
  }, [locationAddress]);

  const radiusSummary = useMemo(
    () => `${Math.round(safeRadius)} km`,
    [safeRadius],
  );

  const timeSummary = useMemo(() => {
    if (!eventDate) return "Any time";

    return eventDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }, [eventDate]);

  const searchSummary = useMemo(
    () =>
      `${keywordSummary} • ${addressSummary} • ${radiusSummary} • ${timeSummary}`,
    [addressSummary, keywordSummary, radiusSummary, timeSummary],
  );

  const searchSegments = useMemo(() => {
    return [
      { label: keywordSummary || "Anything", isBold: true },
      { label: addressSummary || "Anywhere", isBold: false },
      {
        label: `${timeSummary}${radiusSummary ? ` • ${radiusSummary}` : ""}`,
        isBold: false,
      },
    ].filter((s) => !!s.label);
  }, [keywordSummary, addressSummary, timeSummary, radiusSummary]);

  const resultCountLabel = useMemo(() => {
    const count = items.length;
    return `${count} result${count === 1 ? "" : "s"}`;
  }, [items.length]);

  const isSheetVisible = sheetIndex >= 0;
  const isInvalidSearch = hasHydrated && !validSearchOptions;
  const isInitialLoading = isLoading && items.length === 0;
  const hasError = !!error && items.length === 0;
  const isEmpty =
    !isInitialLoading &&
    !hasError &&
    items.length === 0 &&
    !!validSearchOptions;

  const openListSheet = useCallback((withHaptics = true) => {
    if (withHaptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(
        () => undefined,
      );
    }

    setSheetIndex(0);
    requestAnimationFrame(() => {
      sheetRef.current?.snapToIndex(0);
    });
  }, []);

  const handleOpenRefine = useCallback(() => {
    router.push(POST_ROUTE.search);
  }, []);

  const handleRetry = useCallback(() => {
    void refetch();
  }, [refetch]);

  const handleListButtonPress = useCallback(() => {
    openListSheet(true);
  }, [openListSheet]);

  const handleSheetChange = useCallback((nextIndex: number) => {
    setSheetIndex(nextIndex);
  }, []);

  const handleSheetClose = useCallback(() => {
    setSheetIndex(-1);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(
      () => undefined,
    );
  }, []);

  const handleLoadMore = useCallback(() => {
    if (!hasMore || isFetchingNextPage) return;
    loadMore();
  }, [hasMore, isFetchingNextPage, loadMore]);

  const handleMarkerPress = useCallback(
    (item: Post) => {
      const coordinate = item.location;
      if (!coordinate) return;

      const markerRegion = buildRegionByRadius(coordinate, safeRadius);
      mapRef.current?.animateToRegion(markerRegion, 280);
      openListSheet(false);
    },
    [safeRadius, openListSheet],
  );

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.2}
        pressBehavior="close"
      />
    ),
    [],
  );

  const renderPostItem = useCallback(
    ({ item, index }: { item: Post; index: number }) => (
      <MotiView
        from={{ opacity: 0, translateY: 24 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{
          type: "timing",
          duration: 260,
          delay: (index + 1) * 100,
        }}
      >
        <PostCard item={item} />
      </MotiView>
    ),
    [],
  );

  const renderListFooter = useCallback(() => {
    if (!isFetchingNextPage) return <View style={{ height: 12 }} />;

    return (
      <View className="py-md items-center justify-center">
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }, [isFetchingNextPage]);

  const renderListEmpty = useCallback(() => {
    if (isInitialLoading) return null;

    return (
      <View className="py-xl px-md items-center">
        <Text className="text-sm text-textMuted">No matching posts found.</Text>
      </View>
    );
  }, [isInitialLoading]);

  const feedbackState = useMemo(() => {
    if (isInvalidSearch) {
      return {
        title: "Search filters are incomplete",
        description: "Please refine your search before viewing results.",
        actionLabel: "Refine search",
        onPress: handleOpenRefine,
      };
    }

    if (isInitialLoading) {
      return {
        title: "Finding matching posts",
        description: "Looking around your selected area.",
        actionLabel: null,
        onPress: null,
      };
    }

    if (hasError) {
      return {
        title: "Couldn’t load search results",
        description: "Check your connection and try again.",
        actionLabel: "Try again",
        onPress: handleRetry,
      };
    }

    if (isEmpty) {
      return {
        title: "No posts found",
        description: "Try widening your radius or changing keywords.",
        actionLabel: "Refine search",
        onPress: handleOpenRefine,
      };
    }

    return null;
  }, [
    handleOpenRefine,
    handleRetry,
    hasError,
    isEmpty,
    isInitialLoading,
    isInvalidSearch,
  ]);

  useEffect(() => {
    if (!hasHydrated || !validSearchOptions?.filters.location) return;
    mapRef.current?.animateToRegion(mapRegion, 320);
  }, [hasHydrated, mapRegion, validSearchOptions?.filters.location]);

  if (!hasHydrated) {
    return (
      <View className="flex-1 items-center justify-center bg-surface">
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <>
      <View className="flex-1 bg-surface">
        {/* Header Section */}
        <Stack.Screen
          options={{
            headerShown: true,
            headerTransparent: true,
            header: () => (
              <View
                className="flex-row gap-md items-center px-md"
                style={{ paddingTop: insets.top }}
              >
                <View className="rounded-full items-center justify-center shadow-sm overflow-hidden">
                  <BlurView intensity={90} tint="light">
                    <AppBackButton
                      type="arrowLeftIcon"
                      size={20}
                      showBackground={false}
                    />
                  </BlurView>
                </View>

                {/* Search Input */}
                <Pressable
                  onPress={handleOpenRefine}
                  className="flex-1 p-md rounded-full bg-white flex-row items-center justify-center shadow-sm"
                >
                  <Text
                    className="flex-1 text-sm font-md2 text-textPrimary"
                    numberOfLines={1}
                  >
                    {searchSummary}
                  </Text>
                </Pressable>

                {/* Filter Button */}
                <TouchableIconButton
                  icon={
                    <View className="rounded-full items-center justify-center shadow-sm overflow-hidden">
                      <BlurView intensity={90} tint="light">
                        <View className="p-sm">
                          <FadersIcon size={20} />
                        </View>
                      </BlurView>
                    </View>
                  }
                  onPress={() => {}}
                />
              </View>
            ),
          }}
        />

        {/* Map Background */}
        <MapView
          ref={mapRef}
          style={{ flex: 1 }}
          initialRegion={mapRegion}
          showsCompass
        >
          {/*Marker for safe coordinates */}
          {safeCoords && <Marker coordinate={safeCoords} />}

          {/* Safe Area Circle */}
          {safeCoords && (
            <Circle
              center={safeCoords}
              radius={safeRadius * 1000}
              strokeColor={colors.info[500]}
              strokeWidth={1.5}
              fillColor={`${colors.info[500]}20`}
            />
          )}

          {markerItems.map((item) => (
            <ItemPlaceMarker
              key={item.id}
              item={item}
              coordinate={item.location}
              disabled={false}
              onPress={() => handleMarkerPress(item)}
            />
          ))}
        </MapView>

        {!isSheetVisible && !isInvalidSearch && !isInitialLoading && (
          <View
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: insets.bottom + 18,
              zIndex: 25,
              alignItems: "center",
            }}
            pointerEvents="box-none"
          >
            <Pressable
              onPress={handleListButtonPress}
              className="h-control-lg rounded-full bg-black px-lg flex-row items-center gap-xs"
            >
              <ListBulletsIcon size={16} color={colors.white} weight="bold" />

              <Text className="text-sm font-medium text-white">
                Show list · {resultCountLabel}
              </Text>
            </Pressable>
          </View>
        )}

        {feedbackState && (
          <View
            className="absolute items-center px-lg"
            style={{
              top: insets.top + 72,
              left: 0,
              right: 0,
              zIndex: 24,
            }}
            pointerEvents="box-none"
          >
            <View className="w-full max-w-md rounded-2xl bg-white/95 p-lg shadow-sm border border-slate-100">
              <Text className="text-base font-semibold text-textPrimary">
                {feedbackState.title}
              </Text>

              <Text className="mt-xs text-sm text-textMuted">
                {feedbackState.description}
              </Text>

              {isInitialLoading ? (
                <View className="mt-md">
                  <ActivityIndicator color={colors.primary} />
                </View>
              ) : null}
            </View>
          </View>
        )}

        <BottomSheetPrimitive
          ref={sheetRef}
          index={sheetIndex}
          snapPoints={LIST_SNAP_POINTS}
          enablePanDownToClose
          onChange={handleSheetChange}
          onClose={handleSheetClose}
          backdropComponent={renderBackdrop}
          backgroundStyle={{ backgroundColor: colors.white }}
          handleIndicatorStyle={{
            backgroundColor: colors.slate[300],
            width: 40,
            height: 6,
          }}
          animationConfigs={{ duration: 120 }}
        >
          <View className="px-md pb-sm pt-sm border-b border-slate-100 flex-row items-center justify-between">
            <Text className="text-sm font-semibold text-textPrimary">
              {resultCountLabel}
            </Text>

            <Pressable onPress={handleOpenRefine}>
              <Text className="text-sm font-medium text-primary">
                Edit search
              </Text>
            </Pressable>
          </View>

          <BottomSheetFlatList<Post>
            data={items}
            keyExtractor={(item: Post) => item.id}
            renderItem={renderPostItem}
            numColumns={2}
            columnWrapperStyle={{
              justifyContent: "space-between",
              marginBottom: 12,
            }}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingTop: 12,
              paddingBottom: insets.bottom + 24,
            }}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.35}
            ListFooterComponent={renderListFooter}
            ListEmptyComponent={renderListEmpty}
            showsVerticalScrollIndicator={false}
          />
        </BottomSheetPrimitive>
      </View>
    </>
  );
};

export default PostSearchResultScreen;
