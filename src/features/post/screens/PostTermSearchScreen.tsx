import { usePostSearchStore } from "@/src/features/post/hooks/usePostSearchStore";
import { TextSearch, textSearchSchema } from "@/src/features/post/schemas";
import { AppInlineError, AppSearchRow } from "@/src/shared/components";
import { colors } from "@/src/shared/theme";
import { getErrorMessage } from "@/src/shared/utils";
import * as Haptics from "expo-haptics";
import { MotiView } from "moti";
import {
  CameraIcon,
  ClockClockwiseIcon,
  MagnifyingGlassIcon,
  XCircleIcon,
} from "phosphor-react-native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  LayoutChangeEvent,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

type PostKeywordFilterProps = {
  isExpanded: boolean;
  onToggle: () => void;
};

const PostKeywordFilter = ({
  isExpanded,
  onToggle,
}: PostKeywordFilterProps) => {
  const searchInputRef = useRef<TextInput>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [measuredHeight, setMeasuredHeight] = useState(0);

  const searchTerm = usePostSearchStore((state) => state.keyword.value);
  const keywordHistory = usePostSearchStore((state) => state.keyword.history);

  const updateKeyword = usePostSearchStore((state) => state.updateKeyword);
  const resetKeyword = usePostSearchStore((state) => state.resetKeyword);

  const handleLayoutMeasure = useCallback(
    (event: LayoutChangeEvent) => {
      const { height } = event.nativeEvent.layout;
      const nextHeight = Math.ceil(height);
      if (nextHeight > 0 && nextHeight !== measuredHeight)
        setMeasuredHeight(nextHeight);
    },
    [measuredHeight],
  );

  const searchValidationError = useMemo(() => {
    try {
      textSearchSchema.validateSync(searchTerm, { abortEarly: true });
      return null;
    } catch (err) {
      return getErrorMessage(err);
    }
  }, [searchTerm]);

  const handleRecentSelection = useCallback(
    (value: TextSearch) => updateKeyword(value),
    [updateKeyword],
  );

  const handleInputFocus = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsInputFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsInputFocused(false);
  }, []);

  const recentItemsPreview = useMemo(
    () => keywordHistory.slice(0, 3),
    [keywordHistory],
  );

  const SearchHeaderTitle = useMemo(() => {
    const title = isExpanded ? "What?" : "What";
    const textStyle = isExpanded
      ? "text-xl font-medium text-textPrimary"
      : "text-md font-normal text-textMuted";

    return (
      <Text className={textStyle} numberOfLines={1}>
        {title}
      </Text>
    );
  }, [isExpanded]);

  const SearchHeaderSummary = useMemo(() => {
    if (searchValidationError)
      return <AppInlineError message={searchValidationError} />;

    return (
      <Text className="text-sm text-textMuted text-right" numberOfLines={1}>
        {searchTerm || "Anything"}
      </Text>
    );
  }, [searchValidationError, searchTerm]);

  const SearchInputSection = useMemo(
    () => (
      <View className="gap-md">
        {/* Search Input Field */}
        <View
          className="flex-row items-center rounded-sm"
          style={{
            borderColor: colors.border.strong,
            borderWidth: isInputFocused ? 1.5 : 1,
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
            ref={searchInputRef}
            className="flex-1 font-thin text-textPrimary text-sm"
            value={searchTerm ?? ""}
            onChangeText={updateKeyword}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder="Lost or found something"
            placeholderTextColor={colors.text.muted}
            cursorColor={colors.black}
            selectionColor={colors.black}
          />

          {searchTerm && (
            <Pressable onPress={resetKeyword} hitSlop={8}>
              <XCircleIcon size={20} weight="bold" color={colors.secondary} />
            </Pressable>
          )}

          {/* Camera Button */}
          <View className="p-md">
            <Pressable
              onPress={() => {}}
              className="overflow-hidden rounded-sm bg-surface active:bg-slate-50"
            >
              <CameraIcon size={24} color={colors.primary} weight="duotone" />
            </Pressable>
          </View>
        </View>

        {/* Recent Searches Section */}
        <View className="gap-sm ">
          <Text className="text-sm font-thin text-textPrimary">
            Recent searches
          </Text>

          <View>
            {recentItemsPreview.length === 0 ? (
              <Text className="text-sm text-textMuted italic">
                No recent searches.
              </Text>
            ) : (
              <View className="flex-col gap-sm">
                {recentItemsPreview.map((item) => (
                  <View key={`keyword-recent-${item}`}>
                    <AppSearchRow
                      IconComponent={ClockClockwiseIcon}
                      text={item ?? ""}
                      onPress={() => handleRecentSelection(item)}
                    />
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </View>
    ),
    [
      searchTerm,
      updateKeyword,
      handleInputFocus,
      handleInputBlur,
      resetKeyword,
      recentItemsPreview,
      handleRecentSelection,
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
      {/* Hidden Mirror for measurement */}
      <View
        style={{ position: "absolute", opacity: 0, left: 0, right: 0 }}
        onLayout={handleLayoutMeasure}
        pointerEvents="none"
      >
        <View className="p-md">{SearchInputSection}</View>
      </View>

      {/* Interactable Header */}
      <Pressable
        onPress={onToggle}
        className="p-md gap-md flex-row justify-between items-center "
      >
        <View>{SearchHeaderTitle}</View>
        <View className="flex-1 ml-2">{SearchHeaderSummary}</View>
      </Pressable>

      {/* Expandable Search Section */}
      <MotiView
        animate={{
          height: isExpanded ? measuredHeight : 0,
          opacity: isExpanded ? 1 : 0,
        }}
        transition={{ type: "timing", duration: 300 }}
        className="overflow-hidden"
      >
        {measuredHeight > 0 && (
          <View className="p-md">{SearchInputSection}</View>
        )}
      </MotiView>
    </View>
  );
};

export default PostKeywordFilter;
