import { usePostSearchStore } from "@/src/features/post/hooks/usePostSearchStore";
import PostEventTimeSearchScreen from "@/src/features/post/screens/PostEventTimeSearchScreen";
import PostTermSearchScreen from "@/src/features/post/screens/PostTermSearchScreen";
import { AppBackButton, AppLink } from "@/src/shared/components";
import { POST_ROUTE } from "@/src/shared/constants";
import { colors } from "@/src/shared/theme";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { MotiView } from "moti";
import {
  MagnifyingGlassIcon,
  PackageIcon,
  UsersThreeIcon,
  type IconProps,
} from "phosphor-react-native";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  eventTimeSchema,
  locationSearchSchema,
  textSearchSchema,
} from "../schemas";
import PostLocationSearchScreen from "./PostLocationSearchScreen";

type SearchTabValue = "posts" | "people";
type FilterSectionVariant = "location" | "item" | "event";

const SEARCH_TYPE_TABS: {
  key: SearchTabValue;
  label: string;
  Icon: React.ComponentType<IconProps>;
}[] = [
  {
    key: "posts",
    label: "Post",
    Icon: PackageIcon,
  },
  {
    key: "people",
    label: "People",
    Icon: UsersThreeIcon,
  },
];

const DEFAULT_EXPANDED_SECTION: FilterSectionVariant = "item";
const DEFAULT_BLUR_INTENSITY = 100;

type SearchTabSelectorProps = {
  selectedTab: SearchTabValue;
  onChangeTab: (value: SearchTabValue) => void;
};

const SearchTabSelector = ({
  selectedTab,
  onChangeTab,
}: SearchTabSelectorProps) => {
  return (
    <View className="flex-1 flex-row items-center justify-evenly px-lg">
      {SEARCH_TYPE_TABS.map(({ key, label, Icon }) => {
        const active = selectedTab === key;

        return (
          <Pressable
            key={key}
            onPress={() => onChangeTab(key)}
            className="items-center justify-center"
            style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
          >
            <MotiView
              className="items-center w-full gap-xs"
              animate={{
                opacity: active ? 1 : 0.72,
                scale: active ? 1.03 : 1,
                translateY: active ? -1 : 0,
              }}
              transition={{ type: "timing", duration: 180 }}
            >
              <Icon
                size={30}
                color={active ? colors.black : colors.secondary}
                weight={active ? "regular" : "thin"}
              />

              <Text
                className={`text-xs ${active ? "text-black font-normal" : "text-secondary font-thin"}`}
              >
                {label}
              </Text>

              <MotiView
                animate={{
                  opacity: active ? 1 : 0,
                  scaleX: active ? 1 : 0.4,
                }}
                transition={{ type: "timing", duration: 200 }}
                className="rounded-full bg-textPrimary w-full h-0.5"
              />
            </MotiView>
          </Pressable>
        );
      })}
    </View>
  );
};

const PostSearchScreen = () => {
  const insets = useSafeAreaInsets();
  const [selectedTab, setSelectedTab] = useState<SearchTabValue>("posts");
  const [expandedSection, setExpandedSection] = useState<FilterSectionVariant>(
    DEFAULT_EXPANDED_SECTION,
  );

  const hasHydrated = usePostSearchStore.persist.hasHydrated();
  const resetFilters = usePostSearchStore((state) => state.resetFilters);

  const keywordSearch = usePostSearchStore((state) => state.keyword);
  const locationSearch = usePostSearchStore((state) => state.location);
  const eventTimeSearch = usePostSearchStore((state) => state.temporal);

  const addToKeywordHistory = usePostSearchStore(
    (state) => state.addToKeywordHistory,
  );

  const addToLocationHistory = usePostSearchStore(
    (state) => state.addToLocationHistory,
  );

  const canSearch = useMemo(() => {
    const isKeywordValid = textSearchSchema.isValidSync(keywordSearch.value);
    const isLocationValid = locationSearchSchema.isValidSync(locationSearch);
    const isEventTimeValid = eventTimeSchema.isValidSync(eventTimeSearch.date);
    return isKeywordValid && isLocationValid && isEventTimeValid;
  }, [keywordSearch, locationSearch, eventTimeSearch]);

  const onChangeTab = useCallback(
    (value: SearchTabValue) => {
      if (value === selectedTab) return;

      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setSelectedTab(value);
      setExpandedSection(DEFAULT_EXPANDED_SECTION);
    },
    [selectedTab, setSelectedTab],
  );

  const handleToggleSection = useCallback(
    (section: FilterSectionVariant) => {
      if (expandedSection === section) return;
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setExpandedSection(section);
    },
    [expandedSection],
  );

  const handleClearFilter = useCallback(() => {
    setExpandedSection(DEFAULT_EXPANDED_SECTION);
    resetFilters();
  }, [resetFilters]);

  const handleSubmitSearch = useCallback(() => {
    addToKeywordHistory(keywordSearch.value);
    addToLocationHistory(locationSearch.address);

    router.push(POST_ROUTE.searchResult);
  }, [locationSearch, addToKeywordHistory, addToLocationHistory]);

  if (!hasHydrated) return <ActivityIndicator color={colors.primary} />;

  return (
    <BlurView
      className="flex-1"
      intensity={DEFAULT_BLUR_INTENSITY}
      tint="light"
    >
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="flex-1">
          <View
            className="flex-row items-center px-md"
            style={{ paddingTop: insets.top }}
          >
            <AppBackButton
              type="arrowLeftIcon"
              size={20}
              showBackground={false}
            />

            <SearchTabSelector
              selectedTab={selectedTab}
              onChangeTab={onChangeTab}
            />

            <AppBackButton type="xIcon" size={20} showBackground={false} />
          </View>

          <ScrollView
            className="flex-1 px-md pt-md"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {selectedTab === "posts" ? (
              <View className="gap-md2">
                {/* Item Search */}
                <PostTermSearchScreen
                  onToggle={() => handleToggleSection("item")}
                  isExpanded={expandedSection === "item"}
                />

                {/* Location Search */}
                <PostLocationSearchScreen
                  onToggle={() => handleToggleSection("location")}
                  isExpanded={expandedSection === "location"}
                />

                {/* Event Time Search */}
                <PostEventTimeSearchScreen
                  onToggle={() => handleToggleSection("event")}
                  isExpanded={expandedSection === "event"}
                />
              </View>
            ) : (
              // Placeholder content for People search tab until the feature is implemented.
              <MotiView
                from={{ opacity: 0, translateY: 12 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: "timing", duration: 220 }}
                className="rounded-2xl border bg-white/90 p-lg"
                style={{ borderColor: colors.slate[200] }}
              >
                <Text className="text-base font-semibold text-textPrimary">
                  People search is coming soon
                </Text>
                <Text className="mt-xs text-sm text-textMuted">
                  Switch back to Posts to search lost and found items.
                </Text>
              </MotiView>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>

      {/* Search Button */}
      <View
        className="flex-row items-center justify-between px-md pt-sm"
        style={{ paddingBottom: insets.bottom }}
      >
        <AppLink title="Clear all" onPress={handleClearFilter} />

        <TouchableOpacity
          className="h-control-lg flex-row items-center justify-center gap-xs rounded-sm px-md bg-primary"
          onPress={() => handleSubmitSearch()}
          activeOpacity={0.88}
          accessibilityRole="button"
          disabled={!canSearch}
          style={{ opacity: canSearch ? 1 : 0.6 }}
        >
          <MagnifyingGlassIcon size={20} color={colors.white} weight="bold" />

          <Text className="text-md font-normal tracking-label text-white">
            Search
          </Text>
        </TouchableOpacity>
      </View>
    </BlurView>
  );
};

export default PostSearchScreen;
