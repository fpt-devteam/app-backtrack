import {
  usePlaceAutocomplete,
  usePlaceDetails,
  useUserCoordinates,
} from "@/src/features/map/hooks";
import type { PlacePrediction } from "@/src/features/map/types";
import { usePostCreationStore } from "@/src/features/post/hooks";
import { AppSearchRow } from "@/src/shared/components";
import { colors } from "@/src/shared/theme";
import * as Haptics from "expo-haptics";
import { MotiView } from "moti";
import {
  ClockClockwiseIcon,
  GpsFixIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  XCircleIcon,
} from "phosphor-react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Keyboard, Pressable, Text, TextInput, View } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";

type DisplayMode = "recent" | "suggestions";

const DEFAULT_REGION: Region = {
  latitude: 10.84308399341188,
  longitude: 106.77177212981283,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

const IncidentSceneStepScreen = () => {
  const mapRef = useRef<MapView>(null);
  const inputRef = useRef<TextInput>(null);

  const [isFocused, setIsFocused] = useState(false);
  const [isNearbyActive, setIsNearbyActive] = useState(false);

  const locationAddress = usePostCreationStore(
    (state) => state.location.address,
  );
  const locationCoords = usePostCreationStore((state) => state.location.coords);
  const locationHistory = usePostCreationStore(
    (state) => state.location.history,
  );

  const updateLocationAddress = usePostCreationStore(
    (state) => state.updateLocationAddress,
  );
  const updateLocationCoords = usePostCreationStore(
    (state) => state.updateLocationCoords,
  );
  const addToLocationHistory = usePostCreationStore(
    (state) => state.addToLocationHistory,
  );

  const { getPlaceDetails } = usePlaceDetails();
  const { getUserCoordinates, loading: isGettingUserCoordinates } =
    useUserCoordinates();

  const safeLocationQuery = useMemo(
    () => locationAddress ?? "",
    [locationAddress],
  );

  const displayMode: DisplayMode = useMemo(() => {
    const hasQuery = !!locationAddress?.trim();
    return isFocused && hasQuery ? "suggestions" : "recent";
  }, [isFocused, locationAddress]);

  const { predictions, loading: isSearching } = usePlaceAutocomplete({
    searchQuery: safeLocationQuery,
    enabled: displayMode === "suggestions",
  });

  const displayedSuggestions = useMemo(
    () => predictions.slice(0, 3),
    [predictions],
  );

  const displayRecentQueries = useMemo(() => {
    return locationHistory
      .filter((item): item is string => !!item?.trim())
      .slice(0, 3);
  }, [locationHistory]);

  const mapRegion = useMemo<Region>(
    () => ({
      latitude: locationCoords?.latitude ?? DEFAULT_REGION.latitude,
      longitude: locationCoords?.longitude ?? DEFAULT_REGION.longitude,
      latitudeDelta: DEFAULT_REGION.latitudeDelta,
      longitudeDelta: DEFAULT_REGION.longitudeDelta,
    }),
    [locationCoords?.latitude, locationCoords?.longitude],
  );

  useEffect(() => {
    if (!locationCoords || !mapRef.current) return;

    mapRef.current.animateToRegion(mapRegion, 300);
  }, [locationCoords, mapRegion]);

  useEffect(() => {
    return () => {
      inputRef.current?.blur();
      Keyboard.dismiss();
    };
  }, []);

  const handleFocus = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  const clearQuery = useCallback(() => {
    updateLocationAddress("");
    updateLocationCoords(null);
    setIsNearbyActive(false);
  }, [updateLocationAddress, updateLocationCoords]);

  const onChangeQuery = useCallback(
    (value: string) => {
      setIsNearbyActive(false);
      updateLocationAddress(value);
      updateLocationCoords(null);
    },
    [updateLocationAddress, updateLocationCoords],
  );

  const handleSelectSuggestion = useCallback(
    async (prediction: PlacePrediction) => {
      try {
        const placeDetail = await getPlaceDetails({
          placeId: prediction.placeId,
        });

        const label = placeDetail.formattedAddress;

        setIsNearbyActive(false);
        updateLocationAddress(label);
        updateLocationCoords(placeDetail.location);
        addToLocationHistory(label);
      } catch (error) {
        console.error("Error fetching place details:", error);
      } finally {
        setIsFocused(false);
        inputRef.current?.blur();
        Keyboard.dismiss();
      }
    },
    [
      addToLocationHistory,
      getPlaceDetails,
      updateLocationAddress,
      updateLocationCoords,
    ],
  );

  const handleSelectRecent = useCallback(
    (value: string) => {
      setIsNearbyActive(false);
      updateLocationAddress(value);
      updateLocationCoords(null);
      setIsFocused(true);
      inputRef.current?.focus();
    },
    [updateLocationAddress, updateLocationCoords],
  );

  const handleToggleNearby = useCallback(async () => {
    if (isGettingUserCoordinates) return;

    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (isNearbyActive) {
      setIsNearbyActive(false);
      return;
    }

    const coordinates = await getUserCoordinates();
    if (!coordinates) return;

    setIsNearbyActive(true);
    updateLocationAddress("Nearby");
    updateLocationCoords(coordinates);
    addToLocationHistory("Nearby");

    setIsFocused(false);
    inputRef.current?.blur();
    Keyboard.dismiss();
  }, [
    addToLocationHistory,
    getUserCoordinates,
    isGettingUserCoordinates,
    isNearbyActive,
    updateLocationAddress,
    updateLocationCoords,
  ]);

  const handleMapPress = useCallback(() => {
    setIsFocused(false);
    inputRef.current?.blur();
    Keyboard.dismiss();
  }, []);

  const displayRecentList = useCallback(() => {
    if (displayRecentQueries.length === 0) {
      return (
        <Text className="text-sm text-textMuted">No recent locations.</Text>
      );
    }

    return (
      <View className="flex-col gap-sm mb-sm">
        {displayRecentQueries.map((item, index) => (
          <AppSearchRow
            key={`creation-location-recent-${item}-${index}`}
            IconComponent={ClockClockwiseIcon}
            text={item}
            onPress={() => handleSelectRecent(item)}
          />
        ))}
      </View>
    );
  }, [displayRecentQueries, handleSelectRecent]);

  const displaySuggestionList = useCallback(() => {
    if (isSearching) {
      return <Text className="text-sm text-textMuted">Searching...</Text>;
    }

    if (displayedSuggestions.length === 0) {
      return (
        <Text className="text-sm text-textMuted">
          No suggestions found. Try another location.
        </Text>
      );
    }

    return (
      <View className="flex-col gap-sm mb-sm">
        {displayedSuggestions.map((item) => (
          <AppSearchRow
            key={`creation-location-suggestion-${item.placeId}`}
            IconComponent={MapPinIcon}
            text={item.formattedAddress}
            onPress={() => void handleSelectSuggestion(item)}
          />
        ))}
      </View>
    );
  }, [displayedSuggestions, handleSelectSuggestion, isSearching]);

  return (
    <View className="flex-1 bg-surface">
      {/* Map Background */}
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={mapRegion}
        showsCompass
        onPress={handleMapPress}
      >
        {locationCoords && <Marker coordinate={locationCoords} />}
      </MapView>

      {/* Persistent search panel */}
      <View className="absolute left-lg right-lg top-md">
        <View
          className="rounded-[16] bg-surface py-xs border-surface stroke-slate-200"
          style={{
            borderWidth: 0.75,
            shadowColor: colors.black,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 10,
            elevation: 8,
          }}
        >
          <View className="p-md gap-md">
            <View
              className="flex-row items-center rounded-sm"
              style={{
                borderColor: colors.border.strong,
                borderWidth: isFocused ? 1.5 : 1,
              }}
            >
              <View className="p-md">
                <MagnifyingGlassIcon
                  size={16}
                  weight="bold"
                  color={colors.secondary}
                />
              </View>

              <TextInput
                ref={inputRef}
                value={safeLocationQuery}
                onChangeText={onChangeQuery}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder="Search area or landmark"
                className="flex-1 font-thin text-textPrimary text-sm"
                returnKeyType="search"
                placeholderTextColor={colors.text.muted}
                cursorColor={colors.black}
                selectionColor={colors.black}
              />

              {safeLocationQuery.length > 0 && (
                <Pressable onPress={clearQuery} hitSlop={8}>
                  <XCircleIcon
                    size={20}
                    weight="bold"
                    color={colors.secondary}
                  />
                </Pressable>
              )}

              <View className="p-md">
                <Pressable
                  onPress={() => void handleToggleNearby()}
                  disabled={isGettingUserCoordinates}
                  className="overflow-hidden rounded-sm bg-surface active:bg-slate-50"
                  style={{ opacity: isGettingUserCoordinates ? 0.4 : 1 }}
                >
                  <GpsFixIcon
                    size={24}
                    color={colors.primary}
                    weight="duotone"
                  />
                </Pressable>
              </View>
            </View>

            <View className="gap-sm">
              <Text className="text-sm font-thin text-textPrimary">
                {displayMode === "suggestions"
                  ? "Suggestions"
                  : "Recent locations"}
              </Text>

              <MotiView
                from={{ opacity: 0, translateY: 4 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: "timing", duration: 180 }}
              >
                {displayMode === "recent"
                  ? displayRecentList()
                  : displaySuggestionList()}
              </MotiView>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default IncidentSceneStepScreen;
