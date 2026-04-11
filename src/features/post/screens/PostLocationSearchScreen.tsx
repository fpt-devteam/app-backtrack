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
import {
  Keyboard,
  LayoutChangeEvent,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

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

  const [measuredHeight, setMeasuredHeight] = useState(0);

  const { getPlaceDetails } = usePlaceDetails();

  const { getUserCoordinates, loading: isGettingUserCoordinates } =
    useUserCoordinates();

  const locationQuery = usePostSearchStore((state) => state.location.address);

  const updateLocationAddress = usePostSearchStore(
    (state) => state.updateLocationAddress,
  );

  const updateLocationCoords = usePostSearchStore(
    (state) => state.updateLocationCoords,
  );

  const recents = usePostSearchStore((state) => state.location.history);

  const handleLayoutMeasure = useCallback(
    (event: LayoutChangeEvent) => {
      const { height } = event.nativeEvent.layout;
      const nextHeight = Math.ceil(height);
      if (nextHeight > 0 && nextHeight !== measuredHeight)
        setMeasuredHeight(nextHeight);
    },
    [measuredHeight],
  );

  const safeLocationQuery = useMemo(() => locationQuery ?? "", [locationQuery]);

  const displayMode: DisplayMode = useMemo(() => {
    const hasQuery = !!locationQuery?.trim();
    if (isFocused && hasQuery) return "suggestions";
    return "recent";
  }, [isFocused, locationQuery]);

  const { predictions, loading: isSearching } = usePlaceAutocomplete({
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

  useEffect(() => {
    if (isExpanded) return;
    setIsFocused(false);
    inputRef.current?.blur();
    Keyboard.dismiss();
  }, [isExpanded]);

  const handleToggleNearby = useCallback(async () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (isNearbyActive) {
      setIsNearbyActive(false);
      return;
    }

    const coordinates = await getUserCoordinates();
    if (!coordinates) return;

    updateLocationCoords(coordinates);

    setIsNearbyActive(true);
    setIsFocused(false);
    inputRef.current?.blur();
    Keyboard.dismiss();
  }, [getUserCoordinates, isNearbyActive, updateLocationCoords]);

  const handleSelectSuggestion = useCallback(
    async (prediction: PlacePrediction) => {
      try {
        const res = await getPlaceDetails({ placeId: prediction.placeId });

        setIsNearbyActive(false);
        const label = res.formattedAddress;
        updateLocationAddress(label);
        updateLocationCoords(res.location);
      } catch (error) {
        console.error("Error fetching place details:", error);
      } finally {
        setIsFocused(false);
        inputRef.current?.blur();
        Keyboard.dismiss();
      }
    },
    [getPlaceDetails, updateLocationAddress, updateLocationCoords],
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
    return recents.filter((item): item is string => !!item?.trim()).slice(0, 3);
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
    if (isNearbyActive) return "Nearby";
    if (locationQuery) return locationQuery;
    return "Nearby";
  }, [isNearbyActive, locationQuery]);

  const renderTitle = useMemo(() => {
    if (!isExpanded)
      return (
        <Text className="text-md font-normal text-textMuted" numberOfLines={1}>
          Where
        </Text>
      );

    return (
      <Text className="text-xl font-medium text-textPrimary" numberOfLines={1}>
        Where?
      </Text>
    );
  }, [isExpanded]);

  const renderInforHeader = useMemo(
    () => (
      <Text className="text-sm text-textMuted text-right" numberOfLines={1}>
        {displayLocationQuery}
      </Text>
    ),
    [displayLocationQuery],
  );

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
            IconComponent={MapPinIcon}
            key={`location-suggestion-${item.placeId}`}
            text={item.formattedAddress}
            onPress={() => void handleSelectSuggestion(item)}
          />
        ))}
      </View>
    );
  }, [displayedSuggestions, handleSelectSuggestion]);

  const renderLocationContent = useCallback(
    (isMeasure: boolean) => (
      <View className="gap-sm">
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
            editable={!isMeasure}
            showSoftInputOnFocus={!isMeasure}
            placeholder="Search area or landmark"
            className="flex-1 font-thin text-textPrimary text-sm"
            returnKeyType="search"
            placeholderTextColor={colors.text.muted}
            cursorColor={colors.black}
            selectionColor={colors.black}
          />

          {safeLocationQuery.length > 0 && (
            <Pressable
              onPress={() => clearQuery()}
              hitSlop={8}
              disabled={isMeasure}
            >
              <XCircleIcon size={20} weight="bold" color={colors.secondary} />
            </Pressable>
          )}

          {/* Nearby option */}
          <View className="p-md">
            <Pressable
              onPress={isMeasure ? undefined : () => void handleToggleNearby()}
              className="overflow-hidden rounded-sm bg-surface active:bg-slate-50"
            >
              <GpsFixIcon size={24} color={colors.primary} weight="duotone" />
            </Pressable>
          </View>
        </View>

        <View className="mt-md gap-sm">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-thin text-textPrimary">
              {displayMode === "suggestions"
                ? "Suggestions"
                : "Recent locations"}
            </Text>
          </View>

          {displayMode === "recent"
            ? displayRecentList()
            : displaySuggestionList()}
        </View>
      </View>
    ),
    [
      searchInputContainerStyle,
      safeLocationQuery,
      onChangeQuery,
      handleFocus,
      handleBlur,
      clearQuery,
      handleToggleNearby,
      isGettingUserCoordinates,
      isNearbyActive,
      displayMode,
      displayRecentList,
      displaySuggestionList,
    ],
  );

  return (
    <View
      className="rounded-[16] bg-surface py-xs border-surface stroke-slate-200"
      style={{
        borderWidth: 0.75,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: isExpanded ? 0.385 : 0.2,
        shadowRadius: 10,
      }}
    >
      <View
        style={{ position: "absolute", opacity: 0, left: 0, right: 0 }}
        onLayout={handleLayoutMeasure}
        pointerEvents="none"
      >
        <View className="p-md">{renderLocationContent(true)}</View>
      </View>

      <Pressable
        onPress={onToggle}
        className="p-md gap-md flex-row justify-between items-center"
      >
        <View>{renderTitle}</View>
        <View className="flex-1 ml-2">{renderInforHeader}</View>
      </Pressable>

      <MotiView
        animate={{
          height: isExpanded ? measuredHeight : 0,
          opacity: isExpanded ? 1 : 0,
        }}
        transition={{ type: "timing", duration: 300 }}
        className="overflow-hidden"
      >
        {measuredHeight > 0 && (
          <View className="p-md">{renderLocationContent(false)}</View>
        )}
      </MotiView>
    </View>
  );
};

export default PostLocationSearchScreen;
