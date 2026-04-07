import {
  usePlaceAutocomplete,
  usePlaceDetails,
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
  const { getPlaceDetails } = usePlaceDetails();

  const locationQuery = usePostSearchStore(
    (state) => state.locationSearch.query,
  );

  const setLocationQuery = usePostSearchStore(
    (state) => state.setLocationQuery,
  );

  const locationOptions = usePostSearchStore(
    (state) => state.locationSearch.options,
  );

  const setLocationOptions = usePostSearchStore(
    (state) => state.setLocationOptions,
  );

  const recents = usePostSearchStore(
    (state) => state.locationSearch.recentQuery ?? [],
  );

  const addLocationRecent = usePostSearchStore(
    (state) => state.addLocationRecent,
  );

  const slicedRecents = useMemo(() => recents.slice(0, 3), [recents]);

  const setRadiusInKm = useCallback(
    (value: number) => {
      if (!locationOptions) return;

      setLocationOptions({
        ...locationOptions,
        radiusInKm: value,
      });
    },
    [locationOptions, setLocationOptions],
  );

  const selectRecent = useCallback(
    (value: string) => {
      setLocationQuery(value);
    },
    [setLocationQuery],
  );

  const clearQuery = useCallback(() => {
    setLocationQuery("");
  }, [setLocationQuery]);

  const displayMode: DisplayMode = useMemo(
    () =>
      !isFocused || locationQuery.trim().length === 0
        ? "recent"
        : "suggestions",
    [isFocused, locationQuery],
  );

  const { predictions } = usePlaceAutocomplete({
    searchQuery: locationQuery,
    enabled: displayMode === "suggestions",
  });

  const handleFocus = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  const handleSelectSuggestion = useCallback(
    async (prediction: PlacePrediction) => {
      try {
        const place = await getPlaceDetails({ placeId: prediction.placeId });
        if (!place) return;

        const label =
          place.formattedAddress ||
          prediction.formattedAddress ||
          locationQuery;

        setLocationQuery(label);
        addLocationRecent(label);

        setLocationOptions({
          location: place.location,
          displayAddress: label,
          externalPlaceId: place.id,
          radiusInKm: locationOptions?.radiusInKm ?? DEFAULT_RADIUS_IN_KM,
        });
      } catch (error) {
        console.log(
          "[PostLocationSearchScreen] handleSelectSuggestion:",
          error,
        );
      } finally {
        setIsFocused(false);
        inputRef.current?.blur();
        Keyboard.dismiss();
      }
    },
    [
      getPlaceDetails,
      locationOptions?.radiusInKm,
      locationQuery,
      setLocationOptions,
      setLocationQuery,
    ],
  );

  const handleSelectRecent = useCallback(
    (value: string) => {
      selectRecent(value);
      setIsFocused(true);
      inputRef.current?.focus();
    },
    [selectRecent],
  );

  const onChangeQuery = useCallback(
    (value: string) => {
      setLocationQuery(value);
    },
    [setLocationQuery],
  );

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
    return locationQuery.trim() || "Search area or landmark";
  }, [isExpanded, locationQuery]);

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
    if (!locationOptions) {
      return {
        title: "Radius",
        sub: "Select radius",
      };
    }

    return {
      title: `Radius: ${locationOptions.radiusInKm} km`,
      sub: "Change radius",
    };
  }, [locationOptions]);

  const displayNearbyLabels = useMemo(() => {
    return {
      title: `Nearby`,
      sub: "Find around you",
    };
  }, []);

  const displayRecentList = useCallback(() => {
    if (recents.length === 0) {
      return (
        <Text className="text-sm text-textMuted">No recent searches.</Text>
      );
    }

    return (
      <View className="flex-col gap-sm mb-sm">
        {recents.map((item) => (
          <AppSearchRow
            key={`location-recent-${item}`}
            IconComponent={ClockClockwiseIcon}
            text={item}
            onPress={() => handleSelectRecent(item)}
          />
        ))}
      </View>
    );
  }, [handleSelectRecent, recents]);

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

        <Text className="flex-1 text-sm text-textMuted" numberOfLines={1}>
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
              value={locationQuery}
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

            {locationQuery.length > 0 && (
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
            <View className="flex-1 rounded-sm border border-dashed border-slate-200 bg-surface p-xs active:bg-slate-50">
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
            </View>

            {/* Radius Selector */}
            <View className="flex-1 rounded-sm border border-dashed border-slate-200 bg-surface p-xs active:bg-slate-50">
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
            </View>
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
