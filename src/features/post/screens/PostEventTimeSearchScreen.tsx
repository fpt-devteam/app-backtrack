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
import { LightbulbIcon } from "phosphor-react-native";
import React, { useCallback, useMemo } from "react";
import { Pressable, Text, View } from "react-native";

type PostEventTimeSearchScreenProps = {
  isExpanded: boolean;
  onToggle: () => void;
};

const PostEventTimeSearchScreen = ({
  isExpanded,
  onToggle,
}: PostEventTimeSearchScreenProps) => {
  const eventDate = usePostSearchStore((state) => state.temporal.date);
  const setEventDate = usePostSearchStore((state) => state.updateEventDate);

  const safeEventDate = useMemo(() => {
    if (!eventDate) return new Date();
    return eventDate;
  }, [eventDate]);

  const eventTimeError = useMemo(() => {
    if (!eventDate) return null;

    try {
      eventTimeSchema.validateSync(eventDate, { abortEarly: true });
      return null;
    } catch (err) {
      const messageError = getErrorMessage(err);
      return messageError;
    }
  }, [eventDate]);

  const onChangeDate = useCallback(
    (_event: DateTimePickerEvent, value: Optional<Date>) => {
      if (!value) return;
      setEventDate(value);
    },
    [setEventDate],
  );

  const onChangeTime = useCallback(
    (_event: DateTimePickerEvent, value: Optional<Date>) => {
      if (!value) return;
      setEventDate(value);
    },
    [setEventDate],
  );

  const displayTitle = useMemo(() => {
    if (!isExpanded) return "When";
    else return "When?";
  }, [isExpanded]);

  const displayTitleClassname = useMemo(() => {
    if (!isExpanded) return "text-md font-medium text-textPrimary";
    else return "text-xl font-medium text-textPrimary";
  }, [isExpanded]);

  const displayEventDate = useMemo(() => {
    if (!eventDate) return "Any time";

    const formattedDate = eventDate.toLocaleDateString("en-US", {
      hour: "numeric",
      minute: "numeric",
      weekday: "long",
      month: "short",
      day: "numeric",
    });

    return formattedDate;
  }, [eventDate]);

  const labels = useMemo(
    () => ({
      time: "Last seen at",
      date: "Occurrence date",
      timeSub: "Specify the hour to narrow the search",
      dateSub: "When did you notice it was gone?",
      tip: "The more precise the time, the faster we find it.",
    }),
    [],
  );

  return (
    <View className="rounded-md border border-slate-200 bg-surface">
      <Pressable
        onPress={onToggle}
        className="p-md gap-md flex-row justify-between items-center"
      >
        <Text className={displayTitleClassname} numberOfLines={1}>
          {displayTitle}
        </Text>

        {!eventTimeError ? (
          <Text className="text-sm text-textMuted" numberOfLines={1}>
            {displayEventDate}
          </Text>
        ) : (
          <AppInlineError message={eventTimeError} />
        )}
      </Pressable>

      {isExpanded && (
        <MotiView
          from={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ type: "timing", duration: 1000 }}
          className="px-4 flex-col gap-sm py-sm"
        >
          <View className="gap-sm">
            {/* Section: Time Picker  */}
            <View className="flex-row items-center justify-between px-2 mb-6">
              <View>
                <Text className="text-md font-normal text-textPrimary">
                  {labels.time}
                </Text>
                <Text className="text-xs text-textMuted italic">
                  {labels.timeSub}
                </Text>
              </View>

              <DateTimePicker
                value={safeEventDate}
                mode="time"
                display="compact"
                onChange={onChangeTime}
                accentColor={colors.primary}
              />
            </View>

            {/* Section: Date Picker  */}
            <View className="flex-row items-center justify-between px-2">
              <View>
                <Text className="text-md font-normal text-textPrimary">
                  {labels.date}
                </Text>
                <Text className="text-xs text-textMuted italic">
                  {labels.dateSub}
                </Text>
              </View>

              <DateTimePicker
                value={safeEventDate}
                onChange={onChangeDate}
                mode="date"
                display="compact"
                className="w-full self-center"
                themeVariant="light"
                accentColor={colors.primary}
              />
            </View>
          </View>

          {/* Tips Section */}
          <View className="px-2">
            <View className="flex-row items-center justify-center rounded-2xl py-4 px-6 gap-2 ">
              <View
                style={{
                  transform: [{ rotate: "-15deg" }],
                }}
              >
                <LightbulbIcon size={16} color={colors.amber[500]} />
              </View>

              <Text className="text-center text-xs text-textMuted italic">
                {labels.tip}
              </Text>
            </View>
          </View>
        </MotiView>
      )}
    </View>
  );
};

export default PostEventTimeSearchScreen;
