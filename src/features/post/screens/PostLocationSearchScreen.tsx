import {
  usePlaceAutocomplete,
  usePlaceDetails,
  useUserCoordinates,
} from "@/src/features/map/hooks";
import type { PlacePrediction } from "@/src/features/map/types";
import { usePostSearchStore } from "@/src/features/post/hooks/usePostSearchStore";
import { AppSearchRow } from "@/src/shared/components";
import { colors } from "@/src/shared/theme";
import * as Haptics from "expo-haptics";
import {
  ClockClockwiseIcon,
  GpsFixIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  TargetIcon,
  XCircleIcon,
} from "phosphor-react-native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Keyboard, Pressable, Text, TextInput, View } from "react-native";

const DEFAULT_RADIUS_IN_KM = 5;
const RADIUS_CYCLE_VALUES = [1, 5, 10, 20] as const;

type DisplayMode = "recent" | "suggestions";

type PostLocationSearchScreenProps = {
  isExpanded: boolean;
  onToggle: () => void;
};

const PostLocationSearchScreen = ({
  isExpanded,
  onToggle,
}: PostLocationSearchScreenProps) => {
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isNearbyActive, setIsNearbyActive] = useState(false);
  const { getPlaceDetails } = usePlaceDetails();
  const { getUserCoordinates, loading: isGettingUserCoordinates } =
    useUserCoordinates();

  const locationQuery = usePostSearchStore((state) => state.location.address);

  const updateLocationAddress = usePostSearchStore(
    (state) => state.updateLocationAddress,
  );

  const locationRadius = usePostSearchStore((state) => state.location.radius);

  const updateLocationCoords = usePostSearchStore(
    (state) => state.updateLocationCoords,
  );

  const updateRadius = usePostSearchStore((state) => state.updateRadius);

  const recents = usePostSearchStore((state) => state.location.history);

  const safeLocationQuery = useMemo(() => locationQuery ?? "", [locationQuery]);

  const displayMode: DisplayMode = useMemo(() => {
    const hasQuery = !!locationQuery?.trim();
    if (isFocused && hasQuery) return "suggestions";
    return "recent";
  }, [isFocused, locationQuery]);

  const { predictions } = usePlaceAutocomplete({
    searchQuery: safeLocationQuery,
    enabled: displayMode === "suggestions",
  });

  const selectRecent = useCallback(
    (value: string) => updateLocationAddress(value),
    [updateLocationAddress],
  );

  const clearQuery = useCallback(() => {
    updateLocationAddress("");
  }, [updateLocationAddress]);

  const handleFocus = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  const handleCycleRadius = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const currentRadius =
      typeof locationRadius === "number"
        ? locationRadius
        : RADIUS_CYCLE_VALUES[0];

    const currentIndex = RADIUS_CYCLE_VALUES.findIndex(
      (radius) => radius === currentRadius,
    );

    const nextRadius =
      currentIndex === -1
        ? RADIUS_CYCLE_VALUES[0]
        : RADIUS_CYCLE_VALUES[(currentIndex + 1) % RADIUS_CYCLE_VALUES.length];

    updateRadius(nextRadius);
  }, [locationRadius, updateRadius]);

  const handleToggleNearby = useCallback(async () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (isNearbyActive) {
      setIsNearbyActive(false);
      return;
    }

    const coordinates = await getUserCoordinates();
    if (!coordinates) return;

    updateLocationCoords(coordinates);

    if (!locationRadius) {
      updateRadius(DEFAULT_RADIUS_IN_KM);
    }

    setIsNearbyActive(true);
    setIsFocused(false);
    inputRef.current?.blur();
    Keyboard.dismiss();
  }, [
    getUserCoordinates,
    isNearbyActive,
    locationRadius,
    updateLocationCoords,
    updateRadius,
  ]);

  const handleSelectSuggestion = useCallback(
    async (prediction: PlacePrediction) => {
      try {
        const res = await getPlaceDetails({ placeId: prediction.placeId });

        setIsNearbyActive(false);
        const label = res.formattedAddress;
        updateLocationAddress(label);
        updateLocationCoords(res.location);

        if (!locationRadius) {
          updateRadius(DEFAULT_RADIUS_IN_KM);
        }
      } catch (error) {
        console.error("Error fetching place details:", error);
      } finally {
        setIsFocused(false);
        inputRef.current?.blur();
        Keyboard.dismiss();
      }
    },
    [
      getPlaceDetails,
      locationRadius,
      updateLocationAddress,
      updateLocationCoords,
      updateRadius,
    ],
  );

  const handleSelectRecent = useCallback(
    (value: string) => {
      setIsNearbyActive(false);
      selectRecent(value);
      setIsFocused(true);
      inputRef.current?.focus();
    },
    [selectRecent],
  );

  const onChangeQuery = useCallback(
    (value: string) => {
      setIsNearbyActive(false);
      updateLocationAddress(value);
    },
    [updateLocationAddress],
  );

  const displayRecentQueries = useMemo(() => {
    return recents.filter((item): item is string => !!item?.trim());
  }, [recents]);

  const displayedSuggestions = useMemo(
    () => predictions.slice(0, 3),
    [predictions],
  );

  const borderColor = useMemo(() => {
    return isFocused ? colors.border.strong : colors.border.DEFAULT;
  }, [isFocused]);

  const searchInputContainerStyle = useMemo(
    () => ({
      flex: 1,
      borderColor,
      borderWidth: isFocused ? 2 : 1,
    }),
    [borderColor, isFocused],
  );

  const displayLocationQuery = useMemo(() => {
    if (isExpanded) return "";
    if (isNearbyActive) return "Nearby";
    if (locationQuery) return locationQuery;
    return "Nearby";
  }, [isExpanded, isNearbyActive, locationQuery]);

  const displayTitle = useMemo(() => {
    if (!isExpanded) return "Where";
    return "Where?";
  }, [isExpanded]);

  const displayTitleClassname = useMemo(() => {
    if (!isExpanded) return "text-md font-medium text-textPrimary";
    return "text-xl font-medium text-textPrimary";
  }, [isExpanded]);

  const displayLabels = useMemo(() => {
    if (displayMode === "suggestions") {
      return {
        title: "Suggestions",
        subtitle: "Google Places results",
      };
    }

    return {
      title: "Recent locations",
      subtitle: "Based on your history",
    };
  }, [displayMode]);

  const displayRadiusLabels = useMemo(() => {
    if (!locationRadius) {
      return {
        title: "Radius",
        sub: "Select radius",
      };
    }

    return {
      title: `Radius: ${locationRadius} km`,
      sub: "Tap to change",
    };
  }, [locationRadius]);

  const displayNearbyLabels = useMemo(() => {
    if (isGettingUserCoordinates) {
      return {
        title: "Nearby",
        sub: "Detecting your location...",
      };
    }

    if (isNearbyActive) {
      return {
        title: "Nearby",
        sub: "Using current location",
      };
    }

    return {
      title: `Nearby`,
      sub: "Find around you",
    };
  }, [isGettingUserCoordinates, isNearbyActive]);

  const displayRecentList = useCallback(() => {
    if (displayRecentQueries.length === 0) {
      return (
        <Text className="text-sm text-textMuted">No recent searches.</Text>
      );
    }

    return (
      <View className="flex-col gap-sm mb-sm">
        {displayRecentQueries.map((item, index) => (
          <AppSearchRow
            key={`location-recent-${item}-${index}`}
            IconComponent={ClockClockwiseIcon}
            text={item}
            onPress={() => handleSelectRecent(item)}
          />
        ))}
      </View>
    );
  }, [handleSelectRecent, displayRecentQueries]);

  const displaySuggestionList = useCallback(() => {
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
            IconComponent={MapPinIcon}
            key={`location-suggestion-${item.placeId}`}
            text={item.formattedAddress}
            onPress={() => void handleSelectSuggestion(item)}
          />
        ))}
      </View>
    );
  }, [displayedSuggestions, handleSelectSuggestion]);

  return (
    <View className="rounded-md border border-slate-200 bg-surface">
      <Pressable
        onPress={onToggle}
        className="px-md py-md flex-row items-center justify-between gap-lg"
      >
        <Text className={displayTitleClassname} numberOfLines={1}>
          {displayTitle}
        </Text>

        <Text
          className="flex-1 text-sm text-textMuted "
          style={{ textAlign: "right" }}
          numberOfLines={1}
        >
          {displayLocationQuery}
        </Text>
      </Pressable>

      {isExpanded && (
        <View className="gap-sm px-md">
          <View
            className="flex-row items-center border p-md2 rounded-sm gap-sm"
            style={searchInputContainerStyle}
          >
            <MagnifyingGlassIcon
              size={20}
              weight="bold"
              color={colors.secondary}
            />

            <TextInput
              ref={inputRef}
              value={safeLocationQuery}
              onChangeText={onChangeQuery}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="Search area or landmark"
              placeholderTextColor={colors.text.muted}
              className="flex-1 font-md text-textPrimary"
              returnKeyType="search"
              cursorColor={colors.black}
              selectionColor={colors.black}
            />

            {safeLocationQuery.length > 0 && (
              <Pressable
                onPress={() => {
                  clearQuery();
                  inputRef.current?.focus();
                }}
                hitSlop={8}
              >
                <XCircleIcon size={20} weight="bold" color={colors.secondary} />
              </Pressable>
            )}
          </View>

          {/* Action Buttons */}
          <View className="flex-row items-center gap-sm">
            {/* Nearby Location Selector */}
            <Pressable
              onPress={() => void handleToggleNearby()}
              disabled={isGettingUserCoordinates}
              className="flex-1 rounded-sm border border-dashed border-slate-200 bg-surface p-xs active:bg-slate-50"
              accessibilityRole="button"
              accessibilityLabel="Toggle nearby location"
              style={{
                opacity: isGettingUserCoordinates ? 0.7 : 1,
                borderColor: isNearbyActive
                  ? colors.primary
                  : colors.slate[200],
                backgroundColor: isNearbyActive
                  ? colors.primary + "10"
                  : undefined,
              }}
            >
              <View className="flex-row gap-xs items-center">
                <View className="p-xs items-center justify-center">
                  <GpsFixIcon
                    size={24}
                    color={colors.primary}
                    weight="duotone"
                  />
                </View>

                <View className="flex-1">
                  <Text className="text-sm font-semibold text-textPrimary">
                    {displayNearbyLabels.title}
                  </Text>
                  <Text className="text-xs text-textMuted">
                    {displayNearbyLabels.sub}
                  </Text>
                </View>
              </View>
            </Pressable>

            {/* Radius Selector */}
            <Pressable
              onPress={handleCycleRadius}
              className="flex-1 rounded-sm border border-dashed border-slate-200 bg-surface p-xs active:bg-slate-50"
              accessibilityRole="button"
              accessibilityLabel="Cycle search radius"
            >
              <View className="flex-row gap-xs items-center">
                <View className="p-xs items-center justify-center">
                  <TargetIcon
                    size={24}
                    color={colors.primary}
                    weight="duotone"
                  />
                </View>

                <View className="flex-1">
                  <Text className="text-sm font-semibold text-textPrimary">
                    {displayRadiusLabels.title}
                  </Text>
                  <Text className="text-xs text-textMuted">
                    {displayRadiusLabels.sub}
                  </Text>
                </View>
              </View>
            </Pressable>
          </View>

          {/* Recent/Suggestion Locations */}
          <View className="mt-md gap-sm">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-normal text-textPrimary">
                {displayLabels.title}
              </Text>

              <Text className="text-sm font-normal text-primary">
                {displayLabels.subtitle}
              </Text>
            </View>

            {displayMode === "recent"
              ? displayRecentList()
              : displaySuggestionList()}
          </View>
        </View>
      )}
    </View>
  );
};

export default PostLocationSearchScreen;
