import { PostSuggestionCard } from "@/src/features/post/components";
import { useGetSuggestionPosts } from "@/src/features/post/hooks";
import { TouchableIconButton } from "@/src/shared/components";
import { POST_ROUTE } from "@/src/shared/constants";
import { useRecentSearch } from "@/src/shared/hooks";
import { colors } from "@/src/shared/theme";
import { router, useLocalSearchParams } from "expo-router";
import {
  ArrowLeftIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  TrashIcon,
} from "phosphor-react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  FlatList,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type DisplayMode = "recent" | "suggestions";

const PostSearchOptions = {
  searchBarPlaceholder: "Search for posts or topics, ...",
  searchRecentParams: {
    namespace: "post-search",
    maxItems: 10,
  },
};

const PostSearchScreen = () => {
  const insets = useSafeAreaInsets();
  const { initialQuery } = useLocalSearchParams<{ initialQuery?: string }>();
  const inputRef = useRef<TextInput>(null);
  const fade = useRef(new Animated.Value(1)).current;
  const slide = useRef(new Animated.Value(0)).current;

  const [query, setQuery] = useState((initialQuery ?? "").toString());
  const [isFocused, setIsFocused] = useState(false);

  const {
    items: recentItems,
    add,
    clear,
  } = useRecentSearch(PostSearchOptions.searchRecentParams);

  const { items: suggestionItems, isLoading: isSuggestionLoading } =
    useGetSuggestionPosts();

  const displayMode: DisplayMode = useMemo(
    () => (!isFocused || query.trim().length === 0 ? "recent" : "suggestions"),
    [isFocused, query],
  );

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
  }, [displayMode, fade, slide]);

  const goToResults = async (term: string) => {
    const text = term.trim();
    if (!text) return;

    await add(text);

    Keyboard.dismiss();
    setIsFocused(false);

    router.push({
      pathname: POST_ROUTE.searchResult,
      params: { termSearch: text },
    });
  };

  const handleSelectRecent = (value: string) => {
    setQuery(value);
    setIsFocused(true);
    inputRef.current?.focus();
  };

  const handleSubmit = () => {
    void goToResults(query);
  };

  const handlePressOutside = () => {
    Keyboard.dismiss();
    setIsFocused(false);
  };

  const handlePressSuggestion = (term: string) => {
    void goToResults(term);
  };

  const renderRecentList = () => {
    if (recentItems.length === 0) {
      return (
        <View className="p-3">
          <Text className="text-sm">No recent searches.</Text>
        </View>
      );
    }

    return (
      <View className="flex-row flex-wrap gap-2">
        {recentItems.slice(0, 3).map((item) => (
          <PostRecentSearchRow
            key={item.value}
            text={item.value}
            onPress={() => handleSelectRecent(item.value)}
          />
        ))}
        <TouchableOpacity
          className="self-start flex-row gap-2 items-center rounded-full px-3 py-2 bg-slate-100"
          onPress={() => clear()}
        >
          <TrashIcon size={16} color={colors.primary} weight="bold" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback
      accessible={false}
      onPress={handlePressOutside}
      className="flex-1"
    >
      <View
        className="flex-1 gap-3"
        style={{
          backgroundColor: colors.white,
          paddingTop: insets.top,
        }}
      >
        {/* Top row: Back + Search bar */}
        <View className="flex-row items-center gap-4 px-4">
          <TouchableIconButton
            onPress={() => router.back()}
            icon={
              <ArrowLeftIcon size={24} color={colors.primary} weight="bold" />
            }
          />

          <View
            className="flex-1 flex-row items-center rounded-lg gap-4 overflow-hidden"
            style={{
              borderColor: colors.primary,
              borderWidth: 2,
            }}
          >
            <TextInput
              ref={inputRef}
              value={query}
              onChangeText={setQuery}
              placeholder={PostSearchOptions.searchBarPlaceholder}
              returnKeyType="search"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onSubmitEditing={handleSubmit}
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
        </View>

        <View className="flex-1">
          <FlatList
            data={isSuggestionLoading ? [] : suggestionItems}
            keyExtractor={(_, index) => index.toString()}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <PostSuggestionCard
                item={item}
                onPress={() => handlePressSuggestion(item.itemName)}
              />
            )}
            numColumns={2}
            columnWrapperStyle={{
              justifyContent: "center",
              gap: 12,
              marginBottom: 12,
            }}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View className="flex-col gap-2 py-2">
                <View className="px-3 gap-2">{renderRecentList()}</View>
                <View className="h-[4] bg-gray-100" />
                <Text className="px-3 text-sm font-semibold text-gray-700">
                  Suggestions
                </Text>
              </View>
            }
            contentContainerStyle={{ paddingBottom: insets.bottom }}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const PostRecentSearchRow = ({
  text,
  onPress,
}: {
  text: string;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity
      className="self-start flex-row gap-2 items-center rounded-full px-3 py-2 bg-slate-100"
      onPress={onPress}
    >
      <ClockIcon size={16} color={colors.primary} weight="bold" />
      <Text className="text-sm">{text}</Text>
    </TouchableOpacity>
  );
};

export default PostSearchScreen;
