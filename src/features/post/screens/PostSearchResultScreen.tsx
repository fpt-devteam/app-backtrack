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
import {
  AppBackButton,
  AppLoader,
  TouchableIconButton,
} from "@/src/shared/components";
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
import { AnimatePresence, MotiView } from "moti";
import { FadersIcon, ListBulletsIcon, XIcon } from "phosphor-react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Pressable, Text, View } from "react-native";
import MapView, {
  Circle,
  Marker,
  type LatLng,
  type Region,
} from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const KM_PER_LAT_DEGREE = 111;
const MIN_MAP_DELTA = 0.01;
const LIST_SNAP_POINTS: (string | number)[] = ["40%", "80%"];

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
  const [sheetIndex, setSheetIndex] = useState(0);

  const [chosenPost, setChosenPost] = useState<Post | null>(null);

  const hasHydrated = usePostSearchStore.persist.hasHydrated();
  const keyword = usePostSearchStore((state) => state.keyword.value);
  const locationAddress = usePostSearchStore((state) => state.location.address);
  const locationCoords = usePostSearchStore((state) => state.location.coords);
  const locationRadius = usePostSearchStore((state) => state.location.radius);
  const eventDate = usePostSearchStore((state) => state.temporal.date);

  const selectedPostType = usePostSearchStore(
    (state) => state.advanced.postType,
  );

  const selectedCategories = usePostSearchStore(
    (state) => state.advanced.categories,
  );

  const safeCoords = useMemo(() => {
    if (!locationCoords || !locationSearchSchema.isValidSync(locationCoords)) {
      return locationSearchSchema.getDefault();
    }
    return locationCoords;
  }, [locationCoords]);

  const safeRadius = useMemo(() => {
    if (!locationRadius || !radiusSearchSchema.isValidSync(locationRadius)) {
      return radiusSearchSchema.getDefault();
    }

    return locationRadius;
  }, [locationRadius]);

  const validSearchOptions = useMemo<PostSearchOptions | null>(() => {
    try {
      const castedOptions = postOptionSchema.cast({
        query: keyword ?? "wallet",
        mode: POST_SEARCH_MODE.KEYWORD,
        filters: {
          location: safeCoords,
          radiusInKm: safeRadius,
          postType: selectedPostType,
          eventTime: eventDate,
        },
      }) as PostSearchOptions;

      postOptionSchema.validateSync(castedOptions, { abortEarly: true });
      return castedOptions;
    } catch (_error) {
      return null;
    }
  }, [eventDate, safeCoords, safeRadius, selectedPostType]);

  const mapRegion = useMemo(
    () => buildRegionByRadius(safeCoords, safeRadius),
    [safeCoords, safeRadius],
  );

  const { error, items, isLoading, refetch } = useSearchPost({
    options: validSearchOptions,
    enabled: hasHydrated && !!validSearchOptions,
  });

  const filteredItems = useMemo(() => {
    if (selectedCategories.length === 0) return items;
    return items.filter((item) =>
      selectedCategories.includes(item.item.category),
    );
  }, [items, selectedCategories]);

  const markerItems = useMemo(
    () =>
      filteredItems.filter(
        (item) =>
          item.location?.latitude != null && item.location?.longitude != null,
      ),
    [filteredItems],
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

  const timeSummary = useMemo(() => {
    if (!eventDate) return "Any time";

    return eventDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }, [eventDate]);

  const resultCountLabel = useMemo(() => {
    const count = filteredItems.length;
    return `${count} result${count === 1 ? "" : "s"}`;
  }, [filteredItems.length]);

  const isSheetVisible = sheetIndex >= 0;
  const isInvalidSearch = hasHydrated && !validSearchOptions;
  const isInitialLoading = isLoading && filteredItems.length === 0;
  const hasError = !!error && filteredItems.length === 0;
  const isEmpty =
    !isInitialLoading &&
    !hasError &&
    filteredItems.length === 0 &&
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
    router.back();
  }, []);

  const handleOpenFilter = useCallback(() => {
    router.push(POST_ROUTE.searchFilter);
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

  const handleMarkerPress = useCallback(
    (item: Post) => {
      const coordinate = item.location;
      if (!coordinate) return;

      const markerRegion = buildRegionByRadius(coordinate, safeRadius);
      mapRef.current?.animateToRegion(markerRegion, 280);
      setChosenPost(item);
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
        <PostCard item={item} size="md" />
      </MotiView>
    ),
    [],
  );

  const renderListFooter = useCallback(
    () => <View style={{ height: 12 }} />,
    [],
  );

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

    return null;
  }, [
    handleOpenRefine,
    handleRetry,
    hasError,
    isEmpty,
    isInitialLoading,
    isInvalidSearch,
    selectedCategories.length,
  ]);

  useEffect(() => {
    if (!hasHydrated || !validSearchOptions?.filters.location) return;
    mapRef.current?.animateToRegion(mapRegion, 320);
  }, [hasHydrated, mapRegion, validSearchOptions?.filters.location]);

  if (!hasHydrated) {
    return (
      <View className="flex-1 items-center justify-center bg-surface">
        <AppLoader />
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
                {/* Back Button */}
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
                <View className="flex-1">
                  <Pressable
                    onPress={handleOpenRefine}
                    className="px-lg py-sm rounded-full bg-surface flex-col items-center justify-center shadow-md"
                  >
                    <Text
                      className="flex-1 text-sm font-normal text-textPrimary text-center"
                      numberOfLines={1}
                    >
                      {keywordSummary}
                    </Text>

                    <Text
                      className="flex-1 text-sm font-normal text-textMuted text-center"
                      numberOfLines={1}
                    >
                      {`${addressSummary} • ${timeSummary}`}
                    </Text>
                  </Pressable>
                </View>

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
                  onPress={handleOpenFilter}
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
            <Text>{feedbackState.title}</Text>
            <AppLoader />
          </View>
        )}

        {/* Fading Post Card */}
        <AnimatePresence>
          {chosenPost && (
            <MotiView
              from={{ opacity: 0, translateY: 100, scale: 0.9 }}
              animate={{ opacity: 1, translateY: 0, scale: 1 }}
              exit={{ opacity: 0, translateY: 100, scale: 0.9 }}
              transition={{ type: "spring", damping: 18, stiffness: 150 }}
              className="absolute items-center px-lg gap-md"
              style={{
                bottom: insets.bottom + 16,
                left: 0,
                right: 0,
                zIndex: 50,
              }}
              pointerEvents="box-none"
            >
              {/* XIcon */}
              <View className="absolute top-4 right-12 z-[60]">
                <Pressable
                  onPress={() => setChosenPost(null)}
                  hitSlop={15}
                  className="bg-white rounded-full w-8 h-8 items-center justify-center shadow-md border border-slate-100 active:bg-slate-50"
                >
                  <XIcon size={16} color={colors.slate[600]} weight="bold" />
                </Pressable>
              </View>

              {/* Post Card */}
              <View className="bg-surface rounded-2xl shadow-lg border border-slate-100">
                <PostCard item={chosenPost} size="md" />
              </View>
            </MotiView>
          )}
        </AnimatePresence>

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
          <View className="py-md flex-row items-center justify-between">
            <Text className="text-base font-normal text-textPrimary text-center flex-1">
              {resultCountLabel}
            </Text>
          </View>

          <BottomSheetFlatList<Post>
            data={filteredItems}
            keyExtractor={(item: Post) => item.id}
            renderItem={renderPostItem}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingBottom: insets.bottom,
            }}
            ItemSeparatorComponent={() => <View className="h-4" />}
            ListFooterComponent={renderListFooter}
            ListEmptyComponent={renderListEmpty}
            showsVerticalScrollIndicator={false}
            overScrollMode="never"
          />
        </BottomSheetPrimitive>
      </View>
    </>
  );
};

export default PostSearchResultScreen;
