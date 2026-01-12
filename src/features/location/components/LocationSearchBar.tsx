import type {
  PlaceDetails,
  PlaceSuggestion
} from "@/src/features/location/services/googlePlaces.service";
import { GooglePlacesService } from "@/src/features/location/services/googlePlaces.service";
import SuggestRow from "@/src/shared/components/ui/SuggestRow";
import { useRecentSearch } from "@/src/shared/hooks";
import { colors } from "@/src/shared/theme";
import {
  ArrowLeftIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  XCircleIcon
} from "phosphor-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  FlatList,
  Keyboard,
  Pressable,
  Text,
  TextInput,
  View
} from "react-native";

type LocationSearchBarProps = {
  initialQuery?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  onSelectPlace: (details: PlaceDetails, label: string) => void;
};

type DisplayType = "recent" | "suggest";

function useDebouncedValue<T>(value: T, delayMs: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
}

const LocationSearchBar = ({
  initialQuery = "",
  showBackButton = false,
  onBackPress,
  onSelectPlace,
}: LocationSearchBarProps) => {
  const inputRef = useRef<TextInput>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const fade = useRef(new Animated.Value(1)).current;
  const slide = useRef(new Animated.Value(0)).current;
  const prevDisplayTypeRef = useRef<DisplayType>("recent");

  const [query, setQuery] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);
  const debouncedQuery = useDebouncedValue(query, 350);

  const [suggestions, setSuggestions] = useState<readonly PlaceSuggestion[]>([]);
  const [suggestionStatus, setSuggestionStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [isResolving, setIsResolving] = useState(false);

  const { items: recentItems, add, remove, clear } = useRecentSearch({ namespace: "location-search", maxItems: 7 });

  const displayType: DisplayType = !isFocused || debouncedQuery.trim().length === 0 ? "recent" : "suggest";

  const runSwapAnimation = () => {
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
  };

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    const trimmed = debouncedQuery.trim();

    if (!isFocused || trimmed.length === 0) {
      abortControllerRef.current?.abort();
      setSuggestions([]);
      setSuggestionStatus("idle");
      return;
    }

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setSuggestionStatus("loading");

    GooglePlacesService.autocomplete(trimmed, controller.signal)
      .then((res) => {
        if (controller.signal.aborted) return;
        setSuggestions(res);
        setSuggestionStatus("success");
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        setSuggestions([]);
        setSuggestionStatus("error");
      });
  }, [debouncedQuery, isFocused]);

  useEffect(() => {
    if (prevDisplayTypeRef.current !== displayType) {
      runSwapAnimation();
      prevDisplayTypeRef.current = displayType;
    }
  }, [displayType]);

  const handleClearRecent = () => {
    void clear();
  };

  const handleRemoveRecent = (value: string) => {
    void remove(value);
  };

  const handleSelectRecent = (value: string) => {
    setQuery(value);
    setIsFocused(true);
    inputRef.current?.focus();
  };

  const handleSelectSuggestion = async (item: PlaceSuggestion) => {
    if (isResolving) return;
    setIsResolving(true);
    try {
      const details = await GooglePlacesService.getPlaceDetails(item.placeId);
      if (!details) return;
      const label = details.formattedAddress || item.description || details.name;

      void add(label);
      setQuery(label);
      setIsFocused(false);
      inputRef.current?.blur();
      Keyboard.dismiss();
      onSelectPlace(details, label);
    } finally {
      setIsResolving(false);
    }
  };

  const handleSubmit = () => {
    if (displayType !== "suggest") return;
    const first = suggestions[0];
    if (!first) return;
    void handleSelectSuggestion(first);
  };

  const title = displayType === "suggest" ? "Suggestions" : "Recent";
  const showLoadingRow = displayType === "suggest" && suggestionStatus === "loading" && suggestions.length > 0;

  const renderRecentList = () => {
    return (
      <FlatList
        data={recentItems}
        keyExtractor={(item) => item.value}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View className="p-3">
            <Text className="text-sm text-gray-500">
              No recent searches.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <SuggestRow
            IconComponent={ClockIcon}
            text={item.value}
            onPress={() => handleSelectRecent(item.value)}
            onRemove={() => handleRemoveRecent(item.value)}
          />
        )}
      />
    );
  };

  const renderSuggestionList = () => {
    return (
      <FlatList
        data={suggestions}
        keyExtractor={(item) => item.placeId}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          suggestionStatus === "loading" ? (
            <View className="flex-row items-center gap-2 p-3">
              <ActivityIndicator size="small" color={colors.blue[600]} />
              <Text className="text-sm text-gray-600">Loading...</Text>
            </View>
          ) : (
            <View className="p-3">
              <Text className="text-sm text-gray-500">
                {suggestionStatus === "error"
                  ? "Failed to load suggestions."
                  : "No suggestions."}
              </Text>
            </View>
          )
        }
        ListFooterComponent={
          showLoadingRow ? (
            <View className="flex-row items-center gap-2 p-3">
              <ActivityIndicator size="small" color={colors.blue[600]} />
              <Text className="text-sm text-gray-600">Loading...</Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <SuggestRow
            IconComponent={MapPinIcon}
            text={item.description}
            onPress={() => void handleSelectSuggestion(item)}
          />
        )}
      />
    )
  };

  return (
    <View>
      <View className="flex-row items-center">
        {showBackButton ? (
          <Pressable
            onPress={onBackPress}
            hitSlop={10}
            className="mr-2 h-12 w-12 items-center justify-center rounded-2xl border-2"
            style={{ borderColor: colors.slate[200] }}
          >
            <ArrowLeftIcon size={20} color={colors.slate[700]} />
          </Pressable>
        ) : null}

        <View
          className="flex-1 flex-row items-center border-2 rounded-2xl px-3 h-12"
          style={{ borderColor: isFocused ? colors.primary : colors.slate[200] }}
        >
          <MagnifyingGlassIcon size={20} color={colors.slate[500]} />

          <TextInput
            ref={inputRef}
            value={query}
            onChangeText={setQuery}
            placeholder="Search location..."
            returnKeyType="search"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onSubmitEditing={handleSubmit}
            className="flex-1 ml-2 p-0 text-base"
            placeholderTextColor={colors.slate[400]}
          />

          {query.length > 0 ? (
            <Pressable
              onPress={() => {
                setQuery("");
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
          <Text className="text-base font-semibold">{title}</Text>

          {displayType === "recent" && recentItems.length > 0 ? (
            <Pressable onPress={handleClearRecent} hitSlop={10}>
              <Text className="text-primary font-semibold">Clear</Text>
            </Pressable>
          ) : null}
        </View>

        <Animated.View style={{ opacity: fade, transform: [{ translateY: slide }] }}>
          <View className="mt-3 max-h-[300px]">
            {displayType === "suggest" ? renderSuggestionList() : renderRecentList()}
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

export default LocationSearchBar;
