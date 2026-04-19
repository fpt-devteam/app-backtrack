import { usePostCreationStore } from "@/src/features/post/hooks";
import { eventTimeSchema } from "@/src/features/post/schemas";
import { AppInlineError } from "@/src/shared/components";
import { colors } from "@/src/shared/theme";
import { Optional } from "@/src/shared/types";
import { getErrorMessage } from "@/src/shared/utils";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React, { useCallback, useMemo } from "react";
import { Text, View } from "react-native";

const IncidentTimelineStepScreen = () => {
  const occurrenceDate = usePostCreationStore((state) => state.timeline.date);
  const updateEventDate = usePostCreationStore((state) => state.updateEventDate);

  const safeDate = useMemo(
    () => occurrenceDate ?? new Date(),
    [occurrenceDate],
  );

  const validationError = useMemo(() => {
    if (!occurrenceDate) return "Select the date and time of the incident.";
    try {
      eventTimeSchema.validateSync(occurrenceDate, { abortEarly: true });
      return null;
    } catch (err) {
      return getErrorMessage(err);
    }
  }, [occurrenceDate]);

  const onDateValueChange = useCallback(
    (_event: DateTimePickerEvent, value: Optional<Date>) => {
      if (value) updateEventDate(value);
    },
    [updateEventDate],
  );

  return (
    <View className="flex-1 bg-surface px-lg pt-lg">
      <View className="mb-lg">
        <Text className="text-textPrimary font-normal text-2xl pr-lg tracking-tight">
          When did it happen?
        </Text>
        <Text className="text-textSecondary font-thin text-base mt-2">
          Set the date and approximate time when the item was lost or found.
        </Text>
      </View>

      <View
        className="rounded-3xl border border-divider bg-surface p-md"
        style={{
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
        }}
      >
        <View className="gap-md">
          {/* Time row */}
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

          <View className="border-t border-divider" />

          {/* Date row */}
          <View className="flex-row items-center justify-between">
            <View className="flex-1 mr-4">
              <Text className="text-base font-thin text-textPrimary">Date</Text>
              <Text className="text-sm font-thin text-textMuted italic">
                The day it happened
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
      </View>

      {validationError ? (
        <View className="mt-md">
          <AppInlineError message={validationError} />
        </View>
      ) : null}
    </View>
  );
};

export default IncidentTimelineStepScreen;
