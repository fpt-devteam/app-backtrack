import { POST_ROUTE } from "@/src/shared/constants";
import { COLORS } from "@/src/shared/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Clock, IconProps, MagnifyingGlass, X, XCircle } from "phosphor-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  FlatList,
  GestureResponderEvent,
  Keyboard,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

function useDebouncedValue<T>(value: T, delayMs: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
}

async function fetchSuggestionsMock(q: string): Promise<string[]> {
  const MOCK_SUGGESTIONS_POOL = [
    "Lost wallet black leather",
    "Lost wallet near Ben Thanh Market",
    "Lost iPhone 13 Pro Max",
    "Lost AirPods Pro case only",
    "Lost student ID HCMUT",
    "Lost passport Vietnam",
    "Lost keys with Honda keychain",
    "Lost ring silver with engraving",
    "Lost umbrella at coffee shop",
    "Lost backpack gray laptop inside",

    "Found wallet with ID inside",
    "Found iPhone near Nguyen Hue walking street",
    "Found AirPods in gym locker room",
    "Found keys at parking lot",
    "Found backpack on bus 152",
    "Found watch Apple Watch series 7",
    "Found power bank Anker",
    "Found glasses in cinema",
    "Found helmet on Grab bike",
    "Found bank card (Vietcombank)",

    "Report a lost item",
    "Report a found item",
    "Search by location (District 1)",
    "Search by item category (Electronics)",
  ];


  await new Promise((r) => setTimeout(r, 250));
  const query = q.trim().toLowerCase();
  if (!query) return [];
  return MOCK_SUGGESTIONS_POOL.filter((x) => x.toLowerCase().includes(query)).slice(0, 8);
}

const RecentListService = {
  mockRecentSearch: [
    "Lost wallet near Ben Thanh",
    "Found iPhone 13 in District 1",
    "Lost student ID card",
    "Found keys with Honda keychain",
    "Lost AirPods Pro",
    "Found backpack on bus 152",
  ],

  STORAGE_KEY: "recent_searches_v1",

  normalize(term: string) {
    return term.trim().replace(/\s+/g, " ");
  },

  async load(): Promise<string[]> {
    try {
      const raw = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (!raw) return this.mockRecentSearch;

      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return this.mockRecentSearch;
      return parsed.length ? parsed : this.mockRecentSearch;
    } catch {
      return this.mockRecentSearch;
    }
  },

  async save(list: string[]) {
    try {
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(list));
    } catch {

    }
  },

  buildAddedList(current: string[], term: string, max = 10) {
    const t = this.normalize(term);
    if (!t) return current;
    return [t, ...current.filter((x) => x.toLowerCase() !== t.toLowerCase())].slice(0, max);
  },

  buildRemovedList(current: string[], term: string) {
    const t = this.normalize(term);
    if (!t) return current;
    return current.filter((x) => x.toLowerCase() !== t.toLowerCase());
  },

  async addAndPersist(current: string[], term: string, max = 10) {
    const next = this.buildAddedList(current, term, max);
    await this.save(next);
    return next;
  },

  async removeAndPersist(current: string[], term: string) {
    const next = this.buildRemovedList(current, term);
    await this.save(next);
    return next;
  },

  async clearAndPersist() {
    await this.save([]);
    return [] as string[];
  },
};

type SuggestRowProps = {
  readonly IconComponent?: React.ElementType<IconProps>;
  readonly text: string;
  readonly onPress: () => void;
  readonly onRemove?: () => void;
};

function SuggestRow({ IconComponent = Clock, text, onPress, onRemove }: SuggestRowProps) {
  const handleRemove = (e: GestureResponderEvent) => {
    e.stopPropagation();
    onRemove?.();
  };

  return (
    <TouchableOpacity onPress={onPress} className="flex-row items-center p-2">
      <IconComponent size={18} color={COLORS.slate[500]} />
      <Text style={{ fontSize: 15, marginLeft: 10, flex: 1 }} numberOfLines={1}>
        {text}
      </Text>

      {onRemove ? (
        <TouchableOpacity onPress={handleRemove} hitSlop={10}>
          <X size={18} color={COLORS.slate[400]} />
        </TouchableOpacity>
      ) : null}
    </TouchableOpacity>
  );
}

type DisplayType = "recent" | "suggest";

export default function SearchScreen() {
  const inputRef = useRef<TextInput>(null);

  const [recent, setRecent] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 350);

  const [isFocused, setIsFocused] = useState(false);

  const [displayType, setDisplayType] = useState<DisplayType>("recent");
  const [displayData, setDisplayData] = useState<string[]>([]);

  const fade = useRef(new Animated.Value(1)).current;
  const slide = useRef(new Animated.Value(0)).current;

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
    (async () => {
      const r = await RecentListService.load();
      setRecent(r);
      setDisplayType("recent");
      setDisplayData(r);
    })();
  }, []);


  useEffect(() => {
    if (displayType === "recent") {
      setDisplayData(recent);
    }
  }, [recent, displayType]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const q = debouncedQuery.trim();
      if (!isFocused || q.length === 0) {
        if (displayType === "recent") {
          setDisplayData(recent);
        } else {
          setDisplayType("recent");
          setDisplayData(recent);
          runSwapAnimation();
        }
        return;
      }

      try {
        const res = await fetchSuggestionsMock(q);
        if (cancelled) return;

        const qNorm = RecentListService.normalize(query);
        const next = res.length > 0 ? res : [`Search "${qNorm}"`];

        setDisplayType("suggest");
        setDisplayData(next);
        runSwapAnimation();
      } catch {
        if (cancelled) return;

        const qNorm = RecentListService.normalize(query);
        setDisplayType("suggest");
        setDisplayData([`Search "${qNorm}"`]);
        runSwapAnimation();
      }
    })();

    return () => {
      cancelled = true;
    };

  }, [debouncedQuery, isFocused]);

  const clearRecent = async () => {
    const next = await RecentListService.clearAndPersist();
    setRecent(next);
  };

  const removeRecentItem = async (term: string) => {
    const next = await RecentListService.removeAndPersist(recent, term);
    setRecent(next);
  };

  const applyQueryOnly = (term: string) => {
    const t = RecentListService.normalize(term);
    setQuery(t);
    setIsFocused(true);
    inputRef.current?.focus();
  };

  const goToResults = async (term: string) => {
    const text = RecentListService.normalize(term);
    if (!text) return;

    const next = await RecentListService.addAndPersist(recent, text);
    setRecent(next);

    Keyboard.dismiss();
    setIsFocused(false);

    router.push({
      pathname: POST_ROUTE.searchResult,
      params: { termSearch: text },
    });
  };

  const handlePressOutside = () => {
    Keyboard.dismiss();
    setIsFocused(false);
  };

  const title = displayType === "suggest" ? "Suggestions" : "Recent";

  return (
    <TouchableWithoutFeedback accessible={false} onPress={handlePressOutside}>
      <View className="bg-white flex-1 p-4">
        {/* Search bar */}
        <View
          className="flex-row items-center border-[2px] rounded-2xl px-3 h-12"
          style={{ borderColor: isFocused ? COLORS.blue[500] : COLORS.slate[200] }}
        >
          <MagnifyingGlass size={20} color={COLORS.slate[500]} />

          <TextInput
            ref={inputRef}
            value={query}
            onChangeText={setQuery}
            placeholder="Search..."
            returnKeyType="search"
            onFocus={() => setIsFocused(true)}
            onSubmitEditing={() => goToResults(query)}
            className="flex-1 ml-2 p-0 text-base"
          />

          {query.length > 0 ? (
            <Pressable
              onPress={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              hitSlop={10}
            >
              <XCircle size={20} color={COLORS.slate[400]} />
            </Pressable>
          ) : null}
        </View>

        {/* Divider */}
        <View className="h-[1px] mt-4" style={{ backgroundColor: COLORS.gray[100] }} />

        {/* Header */}
        <View className="mt-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-base font-semibold">{title}</Text>

            {displayType === "recent" && recent.length > 0 ? (
              <Pressable onPress={clearRecent} hitSlop={10}>
                <Text className="text-blue-600 font-semibold">Clear</Text>
              </Pressable>
            ) : null}
          </View>

          {/* Animated list */}
          <Animated.View style={{ opacity: fade, transform: [{ translateY: slide }] }}>
            <View className="mt-3">
              {displayData.length === 0 ? (
                <View className="p-3">
                  <Text className="text-[#6B7280]">
                    {displayType === "suggest" ? "No suggestions." : "No recent searches."}
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={displayData}
                  keyExtractor={(item) => item}
                  keyboardShouldPersistTaps="handled"
                  renderItem={({ item }) => {
                    if (displayType === "suggest") {
                      const isSearchFallback = item.startsWith('Search "');
                      return (
                        <SuggestRow
                          IconComponent={MagnifyingGlass}
                          text={item}
                          onPress={() => goToResults(isSearchFallback ? query : item)}
                        />
                      );
                    }

                    return (
                      <SuggestRow
                        IconComponent={Clock}
                        text={item}
                        onPress={() => applyQueryOnly(item)}
                        onRemove={() => removeRecentItem(item)}
                      />
                    );
                  }}
                />
              )}
            </View>
          </Animated.View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
