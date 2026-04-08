import { usePostSearchStore } from "@/src/features/post/hooks/usePostSearchStore";
import { toast } from "@/src/shared/components/ui/toast";
import { colors } from "@/src/shared/theme";
import * as Haptics from "expo-haptics";

import { useAnalyzeImage } from "@/src/features/post/hooks";
import { TextSearch, textSearchSchema } from "@/src/features/post/schemas";
import { AppInlineError, AppSearchRow } from "@/src/shared/components";
import { getErrorMessage } from "@/src/shared/utils";
import { AnimatePresence, MotiView } from "moti";
import {
  CameraIcon,
  CaretRightIcon,
  ClockClockwiseIcon,
  MagnifyingGlassIcon,
  XCircleIcon,
} from "phosphor-react-native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

type PostTermSearchScreenProps = {
  isExpanded: boolean;
  onToggle: () => void;
};

const PostTermSearchScreen = ({
  isExpanded,
  onToggle,
}: PostTermSearchScreenProps) => {
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);

  const itemQuery = usePostSearchStore((state) => state.keyword.value);
  const updateKeyword = usePostSearchStore((state) => state.updateKeyword);
  const resetKeyword = usePostSearchStore((state) => state.resetKeyword);
  const recents = usePostSearchStore((state) => state.keyword.history);

  const { analyzeImage: _analyzeImage, isAnalyzing: _isAnalyzing } =
    useAnalyzeImage({
      onSuccess: (data) => {
        updateKeyword(data.itemName);
        toast.success("Image analyzed successfully!");
      },
      onError: (_error) => {
        toast.error("Failed to analyze image. Please try again.");
      },
    });

  const selectRecent = useCallback(
    (value: TextSearch) => updateKeyword(value),
    [updateKeyword],
  );

  const safeItemQuery = useMemo(() => itemQuery ?? "", [itemQuery]);

  const searchTermError = useMemo(() => {
    try {
      textSearchSchema.validateSync(itemQuery, { abortEarly: true });
      return null;
    } catch (err) {
      const messageError = getErrorMessage(err);
      return messageError;
    }
  }, [itemQuery]);

  const displayRecents = useMemo(() => recents.slice(0, 3), [recents]);

  const displayTitle = useMemo(() => {
    if (!isExpanded) return "What";
    else return "What?";
  }, [isExpanded]);

  const displayTitleClassname = useMemo(() => {
    if (!isExpanded) return "text-md font-medium text-textPrimary";
    else return "text-xl font-medium text-textPrimary";
  }, [isExpanded]);

  const displayItemQuery = useMemo(() => {
    if (searchTermError) return searchTermError;
    if (isExpanded) return "";
    if (itemQuery) return itemQuery;
    return "Anything";
  }, [isExpanded, itemQuery, searchTermError]);

  const displayLabels = useMemo(() => {
    return {
      recent: "Recent searches",
      recentSub: "Based on your history",
    };
  }, []);

  const displayImageSearchLabels = useMemo(
    () => ({
      title: "Visual Search",
      sub: "AI will identify items from your photo",
      cta: "Upload or Take a photo",
    }),
    [],
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

  const containerTransition = useMemo(
    () => ({
      type: "timing" as const,
      duration: 350,
    }),
    [],
  );

  const containerExitTransition = useMemo(
    () => ({
      type: "timing" as const,
      duration: 650,
      delay: 120,
    }),
    [],
  );

  const expandedSectionStyle = useMemo(
    () => ({
      overflow: "hidden" as const,
    }),
    [],
  );

  const expandedSectionFrom = useMemo(
    () => ({
      opacity: 0,
      height: 0,
    }),
    [],
  );

  const expandedSectionAnimate = useMemo(
    () => ({
      opacity: 1,
      height: "auto" as const,
    }),
    [],
  );

  const expandedSectionExit = useMemo(
    () => ({
      opacity: 0,
      height: 0,
    }),
    [],
  );

  const headerTitleAnimate = useMemo(
    () => ({
      scale: isExpanded ? 1.1 : 1,
      translateY: isExpanded ? -2 : 0,
    }),
    [isExpanded],
  );

  const headerTitleTransition = useMemo(
    () => ({
      type: "timing" as const,
      duration: 220,
    }),
    [],
  );

  const headerSubtitleFrom = useMemo(
    () => ({
      opacity: 0,
      translateY: -2,
    }),
    [],
  );

  const headerSubtitleAnimate = useMemo(
    () => ({
      opacity: 1,
      translateY: 0,
    }),
    [],
  );

  const headerSubtitleExit = useMemo(
    () => ({
      opacity: 0,
      translateY: -2,
    }),
    [],
  );

  const headerSubtitleTransition = useMemo(
    () => ({
      type: "timing" as const,
      duration: 180,
    }),
    [],
  );

  const staggerItemFrom = useMemo(
    () => ({
      opacity: 0,
      translateY: 20,
    }),
    [],
  );

  const staggerItemAnimate = useMemo(
    () => ({
      opacity: 1,
      translateY: 0,
    }),
    [],
  );

  const staggerItemExit = useMemo(
    () => ({
      opacity: 0,
      translateY: -40,
      scale: 0.95,
    }),
    [],
  );

  const searchInputTransition = useMemo(
    () => ({
      type: "timing" as const,
      duration: 350,
      delay: 100,
    }),
    [],
  );

  const visualSearchTransition = useMemo(
    () => ({
      type: "timing" as const,
      duration: 350,
      delay: 200,
    }),
    [],
  );

  const recentSearchTransition = useMemo(
    () => ({
      type: "timing" as const,
      duration: 350,
      delay: 300,
    }),
    [],
  );

  const staggerItemExitTransition = useMemo(
    () => ({
      type: "timing" as const,
      duration: 480,
    }),
    [],
  );

  const handleFocus = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  return (
    <View className="rounded-md border border-slate-200 bg-surface">
      {/* Header Section */}
      <Pressable
        onPress={onToggle}
        className="p-md gap-md flex-row justify-between items-center"
      >
        <MotiView
          animate={headerTitleAnimate}
          transition={headerTitleTransition}
        >
          <Text className={displayTitleClassname} numberOfLines={1}>
            {displayTitle}
          </Text>
        </MotiView>

        <AnimatePresence>
          <MotiView
            key="item-query-subtitle"
            className="flex-1 items-end"
            from={headerSubtitleFrom}
            animate={headerSubtitleAnimate}
            exit={headerSubtitleExit}
            transition={headerSubtitleTransition}
          >
            {searchTermError ? (
              <AppInlineError message={searchTermError} />
            ) : (
              <Text className="text-sm text-textMuted" numberOfLines={1}>
                {displayItemQuery}
              </Text>
            )}
          </MotiView>
        </AnimatePresence>
      </Pressable>

      {/* Expand Section*/}
      <AnimatePresence>
        {isExpanded && (
          <MotiView
            key="expanded-term-search"
            from={expandedSectionFrom}
            animate={expandedSectionAnimate}
            exit={expandedSectionExit}
            transition={containerTransition}
            exitTransition={containerExitTransition}
            style={expandedSectionStyle}
          >
            <View className="gap-sm px-md">
              {/* Search Input */}
              <MotiView
                from={staggerItemFrom}
                animate={staggerItemAnimate}
                exit={staggerItemExit}
                transition={searchInputTransition}
                exitTransition={staggerItemExitTransition}
              >
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
                    className="flex-1 font-md text-textPrimary"
                    value={safeItemQuery}
                    onChangeText={updateKeyword}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder="Wallet, backpack, laptop,..."
                    placeholderTextColor={colors.text.muted}
                    cursorColor={colors.black}
                    selectionColor={colors.black}
                  />

                  {safeItemQuery && safeItemQuery.length > 0 && (
                    <Pressable onPress={resetKeyword} hitSlop={8}>
                      <XCircleIcon
                        size={20}
                        weight="bold"
                        color={colors.secondary}
                      />
                    </Pressable>
                  )}
                </View>
              </MotiView>

              {/* Actions */}
              <MotiView
                from={staggerItemFrom}
                animate={staggerItemAnimate}
                exit={staggerItemExit}
                transition={visualSearchTransition}
                exitTransition={staggerItemExitTransition}
              >
                <Pressable
                  onPress={() => {}}
                  className="overflow-hidden rounded-sm border border-dashed border-slate-200 bg-surface p-xs active:bg-slate-50"
                >
                  <View className="flex-row gap-sm items-center">
                    <View className="p-xs items-center justify-center">
                      <CameraIcon
                        size={24}
                        color={colors.primary}
                        weight="duotone"
                      />
                    </View>

                    <View className="flex-1">
                      <Text className="text-sm font-semibold text-textPrimary">
                        {displayImageSearchLabels.title}
                      </Text>
                      <Text className="text-xs text-textMuted">
                        {displayImageSearchLabels.sub}
                      </Text>
                    </View>

                    <CaretRightIcon
                      size={20}
                      color={colors.info[500]}
                      weight="thin"
                    />
                  </View>
                </Pressable>
              </MotiView>

              {/* Recent Searches */}
              <MotiView
                from={staggerItemFrom}
                animate={staggerItemAnimate}
                exit={staggerItemExit}
                transition={recentSearchTransition}
                exitTransition={staggerItemExitTransition}
              >
                <View className="mt-md gap-sm">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-sm font-normal text-textPrimary">
                      {displayLabels.recent}
                    </Text>

                    <Text className="text-sm font-normal text-primary">
                      {displayLabels.recentSub}
                    </Text>
                  </View>

                  <View className="mb-sm">
                    {displayRecents.length === 0 ? (
                      <Text className="text-xs text-textMuted">
                        No recent searches.
                      </Text>
                    ) : (
                      <View className="flex-col gap-sm">
                        {displayRecents.map((item) => (
                          <AppSearchRow
                            key={`location-recent-${item}`}
                            IconComponent={ClockClockwiseIcon}
                            text={item ?? ""}
                            onPress={() => selectRecent(item)}
                          />
                        ))}
                      </View>
                    )}
                  </View>
                </View>
              </MotiView>
            </View>
          </MotiView>
        )}
      </AnimatePresence>
    </View>
  );
};

export default PostTermSearchScreen;
