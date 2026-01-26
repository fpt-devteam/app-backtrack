import {
  usePlaceAutocomplete,
  usePlaceDetails,
} from "@/src/features/map/hooks";
import { useLocationSelectionStore } from "@/src/features/map/store";
import type { PlacePrediction } from "@/src/features/map/types";
import { SuggestRow } from "@/src/shared/components";
import { MAP_ROUTE } from "@/src/shared/constants";
import { useRecentSearch } from "@/src/shared/hooks";
import { colors } from "@/src/shared/theme";
import { RelativePathString, router } from "expo-router";
import {
  ArrowLeftIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  XCircleIcon,
} from "phosphor-react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  FlatList,
  Keyboard,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

type DisplayMode = "recent" | "suggestions";

const MapSearchOptions = {
  searchBarPlaceholder: "Search location...",

  searchRecentParams: {
    namespace: "map-search",
    maxItems: 10,
  },
};

export const MapSearchScreen = () => {
  const inputRef = useRef<TextInput>(null);
  const fade = useRef(new Animated.Value(1)).current;
  const slide = useRef(new Animated.Value(0)).current;

  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const insets = useSafeAreaInsets();
  const {
    items: recentItems,
    add,
    remove,
    clear,
  } = useRecentSearch(MapSearchOptions.searchRecentParams);
  const { selection, onChangeSelection } = useLocationSelectionStore();
  const { getPlaceDetails } = usePlaceDetails();

  const displayMode: DisplayMode = useMemo(
    () =>
      !isFocused || searchQuery.trim().length === 0 ? "recent" : "suggestions",
    [isFocused, searchQuery],
  );

  const { predictions } = usePlaceAutocomplete({
    searchQuery,
    enabled: displayMode === "suggestions",
  });

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(MAP_ROUTE.index as RelativePathString);
    }
  };

  useEffect(() => {
    fade.stopAnimation();
    slide.stopAnimation();

    fade.setValue(0);
    slide.setValue(8);

    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 180,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      Animated.timing(slide, {
        toValue: 0,
        duration: 180,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [displayMode]);

  const handleSelectPlace = async (prediction: PlacePrediction) => {
    try {
      const place = await getPlaceDetails({ placeId: prediction.placeId });

      if (!place) {
        console.log(
          "[MapSearchScreen] No details found for placeId:",
          prediction.placeId,
        );
        return;
      }

      const description = prediction.formattedAddress;
      const label = place.formattedAddress || description || searchQuery;

      await add(label);
      setSearchQuery(label);

      try {
        const data = {
          ...selection,
          location: place.location,
          displayAddress: label,
          externalPlaceId: place.id,
        };
        onChangeSelection(data);
      } catch (e) {
        console.log("[MapSearchScreen] handleSelectPlace failed:", e);
      }
    } catch (e) {
      console.log("[MapSearchScreen] handleSelectPlace failed:", e);
    } finally {
      setIsFocused(false);
      inputRef.current?.blur();
      Keyboard.dismiss();
      handleBack();
    }
  };

  const handleSelectRecent = (value: string) => {
    setSearchQuery(value);
    setIsFocused(true);
    inputRef.current?.focus();
  };

  const handleSubmit = () => {
    if (displayMode !== "suggestions") return;

    const first = predictions[0];
    if (!first) return;

    handleSelectPlace(first);
  };

  const renderSuggestionList = () => {
    return (
      <FlatList
        data={predictions}
        keyExtractor={(item) => item.placeId}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <SuggestRow
            IconComponent={MapPinIcon}
            text={item.formattedAddress}
            onPress={() => handleSelectPlace(item)}
          />
        )}
      />
    );
  };

  const renderRecentList = () => {
    return (
      <FlatList
        data={recentItems}
        keyExtractor={(item) => item.value}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <SuggestRow
            IconComponent={ClockIcon}
            text={item.value}
            onPress={() => handleSelectRecent(item.value)}
            onRemove={() => void remove(item.value)}
          />
        )}
      />
    );
  };

  const displayTitle = useMemo(
    () => (displayMode === "suggestions" ? "Suggestions" : "Recent"),
    [displayMode],
  );

  return (
    <View
      className="flex-1 px-4"
      style={{
        paddingTop: insets.top,
      }}
    >
      <View className="flex-row items-center">
        <Pressable
          onPress={handleBack}
          hitSlop={10}
          className="mr-2 h-12 w-12 items-center justify-center rounded-2xl"
          style={{ borderColor: colors.slate[200] }}
        >
          <ArrowLeftIcon size={24} color={colors.slate[700]} />
        </Pressable>

        <View
          className="flex-1 flex-row items-center border-2 rounded-2xl px-3 h-12"
          style={{
            borderColor: isFocused ? colors.primary : colors.slate[200],
          }}
        >
          <MagnifyingGlassIcon size={20} color={colors.slate[500]} />

          <TextInput
            ref={inputRef}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={MapSearchOptions.searchBarPlaceholder}
            returnKeyType="search"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onSubmitEditing={handleSubmit}
            className="flex-1 ml-2 p-0 text-base"
            placeholderTextColor={colors.slate[400]}
          />

          {searchQuery.length > 0 ? (
            <Pressable
              onPress={() => {
                setSearchQuery("");
                inputRef.current?.focus();
              }}
              hitSlop={10}
            >
              <XCircleIcon size={20} color={colors.slate[400]} />
            </Pressable>
          ) : null}
        </View>
      </View>

      <View className="mt-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-base font-semibold">{displayTitle}</Text>
          {displayMode === "recent" && recentItems.length > 0 ? (
            <Pressable onPress={() => void clear()} hitSlop={10}>
              <Text className="text-primary font-semibold">Clear</Text>
            </Pressable>
          ) : null}
        </View>

        <Animated.View
          style={{ opacity: fade, transform: [{ translateY: slide }] }}
        >
          <View className="mt-3 max-h-[300px]">
            {displayMode === "recent"
              ? renderRecentList()
              : renderSuggestionList()}
          </View>
        </Animated.View>
      </View>
    </View>
  );
};
