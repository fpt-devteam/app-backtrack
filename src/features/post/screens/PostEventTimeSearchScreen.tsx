import { usePostSearchStore } from "@/src/features/post/hooks/usePostSearchStore";
import { eventTimeSchema } from "@/src/features/post/schemas";
import { AppInlineError } from "@/src/shared/components";
import { colors } from "@/src/shared/theme";
import { Optional } from "@/src/shared/types";
import { getErrorMessage } from "@/src/shared/utils";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { MotiView } from "moti";
import React, { useCallback, useMemo, useState } from "react";
import { LayoutChangeEvent, Pressable, Text, View } from "react-native";

type PostTemporalFilterProps = {
  isExpanded: boolean;
  onToggle: () => void;
};

const PostTemporalFilter = ({
  isExpanded,
  onToggle,
}: PostTemporalFilterProps) => {
  const occurrenceDate = usePostSearchStore((state) => state.temporal.date);
  const updateOccurrenceDate = usePostSearchStore(
    (state) => state.updateEventDate,
  );

  const [measuredHeight, setMeasuredHeight] = useState(0);

  const handleLayoutMeasure = useCallback(
    (event: LayoutChangeEvent) => {
      const { height } = event.nativeEvent.layout;
      const nextHeight = Math.ceil(height);
      if (nextHeight > 0 && nextHeight !== measuredHeight)
        setMeasuredHeight(nextHeight);
    },
    [measuredHeight],
  );

  const safeDate = useMemo(
    () => occurrenceDate ?? new Date(),
    [occurrenceDate],
  );

  // --- Validation ---
  const validationError = useMemo(() => {
    if (!occurrenceDate) return null;
    try {
      eventTimeSchema.validateSync(occurrenceDate, { abortEarly: true });
      return null;
    } catch (err) {
      return getErrorMessage(err);
    }
  }, [occurrenceDate]);

  const onDateValueChange = useCallback(
    (_event: DateTimePickerEvent, value: Optional<Date>) => {
      if (value) updateOccurrenceDate(value);
    },
    [updateOccurrenceDate],
  );

  const renderHeaderTitle = useMemo(() => {
    const title = isExpanded ? "When?" : "When";
    const textStyle = isExpanded
      ? "text-xl font-medium text-textPrimary"
      : "text-md font-normal text-textMuted";

    return (
      <Text className={textStyle} numberOfLines={1}>
        {title}
      </Text>
    );
  }, [isExpanded]);

  const dateSummary = useMemo(() => {
    if (!occurrenceDate) return "Anytime";

    return occurrenceDate.toLocaleDateString("en-US", {
      hour: "numeric",
      minute: "numeric",
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  }, [occurrenceDate]);

  const renderHeaderSummary = useMemo(() => {
    if (validationError) return <AppInlineError message={validationError} />;

    return (
      <Text className="text-sm text-textMuted text-right" numberOfLines={1}>
        {dateSummary}
      </Text>
    );
  }, [validationError, dateSummary]);

  const renderTimePickers = useMemo(
    () => (
      <View className="gap-md">
        {/* Section: Time Row */}
        <View className="flex-row items-center justify-between">
          <View className="flex-1 mr-4">
            <Text className="text-base font-thin text-textPrimary">Time</Text>
            <Text className="text-sm font-thin text-textMuted italic">
              When was it last seen?
            </Text>
          </View>
          <DateTimePicker
            value={safeDate}
            mode="time"
            display="compact"
            onChange={onDateValueChange}
            accentColor={colors.secondary}
          />
        </View>

        <View className="border-t border-slate-200" />

        {/* Section: Date Row */}
        <View className="flex-row items-center justify-between">
          <View className="flex-1 mr-4">
            <Text className="text-base font-thin text-textPrimary">Date</Text>
            <Text className="text-sm font-thin text-textMuted italic">
              The day it went missing
            </Text>
          </View>
          <DateTimePicker
            value={safeDate}
            onChange={onDateValueChange}
            mode="date"
            display="compact"
            themeVariant="light"
            accentColor={colors.secondary}
          />
        </View>
      </View>
    ),
    [safeDate, onDateValueChange],
  );

  return (
    <View className="rounded-md border-[0.5] border-muted bg-surface overflow-hidden shadow-sm">
      {/* Measure Mirror (Hidden) */}
      <View
        style={{ position: "absolute", opacity: 0, left: 0, right: 0 }}
        onLayout={handleLayoutMeasure}
        pointerEvents="none"
      >
        <View className="p-md">{renderTimePickers}</View>
      </View>

      {/* Interactable Header */}
      <Pressable
        onPress={onToggle}
        className="p-md gap-md flex-row justify-between items-center active:bg-slate-50"
      >
        <View>{renderHeaderTitle}</View>
        <View className="flex-1 ml-2">{renderHeaderSummary}</View>
      </Pressable>

      {/* Collapsible Content */}
      <MotiView
        animate={{
          height: isExpanded ? measuredHeight : 0,
          opacity: isExpanded ? 1 : 0,
        }}
        transition={{ type: "timing", duration: 300 }}
        className="overflow-hidden"
      >
        {measuredHeight > 0 && (
          <View className="p-md">{renderTimePickers}</View>
        )}
      </MotiView>
    </View>
  );
};

export default PostTemporalFilter;
