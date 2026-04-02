import { formatDateTime } from "@/src/shared/utils";
import type { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { CalendarBlankIcon } from "phosphor-react-native";
import React, { useMemo, useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";

type Props = Readonly<{
  label?: string;
  value: Date | null;
  onChange: (next: Date | null) => void;
  placeholder?: string;
  disabled?: boolean;
}>;

const MIN_DATE = new Date(2000, 0, 1);

const FUTURE_TOLERANCE_MS = 1000;

const validateDateTime = (d: Date) => {
  const now = new Date();

  if (d.getTime() > now.getTime() + FUTURE_TOLERANCE_MS) {
    return "Date and time cannot be in the future.";
  }

  if (d.getTime() < MIN_DATE.getTime()) {
    return "Date and time cannot be before Jan 1, 2000.";
  }

  return null;
};

export const DateTimePickerField = ({
  value,
  onChange,
  placeholder = "mm/dd/yyyy, --:--",
  disabled = false,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [temp, setTemp] = useState<Date>(value ?? new Date());
  const [error, setError] = useState<string | null>(null);

  const displayText = useMemo(() => {
    if (!value) return placeholder;
    return formatDateTime(value);
  }, [value, placeholder]);

  const openModal = () => {
    if (disabled) return;

    const now = new Date();
    const initial = value ?? now;

    setTemp(initial.getTime() > now.getTime() ? now : initial);
    setOpen(true);
  };

  const onPressClose = () => {
    setOpen(false);
    setError(null);
  };

  const onPressClear = () => {
    onChange(null);
    onPressClose();
  };

  const onPressDone = () => {
    const err = validateDateTime(temp);
    if (err) {
      setError(err);
      return;
    }

    setError(null);
    onChange(temp);
    onPressClose();
  };

  const onChangeDate = (
    event: DateTimePickerEvent,
    picked: Date | undefined,
  ) => {
    if (!picked) return;

    setTemp((prev) => {
      const next = new Date(prev);
      next.setFullYear(
        picked.getFullYear(),
        picked.getMonth(),
        picked.getDate(),
      );
      return next;
    });
  };

  const onChangeTime = (
    event: DateTimePickerEvent,
    picked: Date | undefined,
  ) => {
    if (!picked) return;

    setTemp((prev) => {
      const next = new Date(prev);
      next.setHours(picked.getHours(), picked.getMinutes(), 0, 0);
      return next;
    });
  };

  return (
    <View className="border-primary">
      <Pressable
        onPress={openModal}
        disabled={disabled}
        className="h-[52px] rounded-[14px] border border-[rgba(9,63,189,0.14)] bg-surface px-3.5 flex-row items-center gap-3"
      >
        <CalendarBlankIcon size={18} color="#94A3B8" />
        <Text
          className={`text-[15px] ${value ? "text-textPrimary" : "text-slate-400"}`}
          numberOfLines={1}
        >
          {displayText}
        </Text>
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={onPressClose}
      >
        <Pressable
          className="flex-1 bg-[rgba(15,23,42,0.35)]"
          onPress={onPressClose}
        />

        {error && (
          <View className="absolute top-[50px] left-5 right-5 bg-red-400 p-2.5 rounded-lg z-[1000]">
            <Text className="text-white font-bold text-center">{error}</Text>
          </View>
        )}

        <View className="absolute left-3.5 right-3.5 bottom-4 rounded-[18px] bg-surface border border-[rgba(15,23,42,0.10)] p-3">
          {/* Header */}
          <View className="px-1.5 pt-1 pb-2.5">
            <View className="flex-row justify-end flex-wrap">
              {/* Clear button */}
              <Pressable
                onPress={onPressClear}
                className="px-3 py-2 rounded-xl border border-[rgba(15,23,42,0.10)] bg-surface ml-2.5 mb-2"
              >
                <Text className="text-[13px] font-bold text-textPrimary">
                  Clear
                </Text>
              </Pressable>

              {/* Cancel button */}
              <Pressable
                onPress={onPressClose}
                className="px-3 py-2 rounded-xl border border-[rgba(15,23,42,0.10)] bg-surface ml-2.5 mb-2"
              >
                <Text className="text-[13px] font-bold text-textPrimary">
                  Cancel
                </Text>
              </Pressable>

              {/* Done button */}
              <Pressable
                onPress={onPressDone}
                className="px-3 py-2 rounded-xl border border-[rgba(14,165,233,0.35)] bg-sky-500 ml-2.5 mb-2"
              >
                <Text className="text-[13px] font-extrabold text-white">
                  Done
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Date Picker */}
          <View className="px-1.5 pb-2.5">
            <Text className="text-[13px] font-extrabold text-textSecondary mb-1.5">
              Date
            </Text>
            <View className="rounded-[14px] border border-[rgba(15,23,42,0.10)] overflow-hidden bg-surface">
              <DateTimePicker
                value={temp}
                mode="date"
                display="spinner"
                onChange={onChangeDate}
                style={{ width: "100%", backgroundColor: "#FFFFFF" }}
                themeVariant="light"
                textColor="#334155"
                minimumDate={MIN_DATE}
                maximumDate={new Date()}
              />
            </View>
          </View>

          {/* Time Picker */}
          <View className="px-1.5 pb-2.5">
            <Text className="text-[13px] font-extrabold text-textSecondary mb-1.5">
              Time
            </Text>
            <View className="rounded-[14px] border border-[rgba(15,23,42,0.10)] overflow-hidden bg-surface">
              <DateTimePicker
                value={temp}
                mode="time"
                display="spinner"
                is24Hour
                onChange={onChangeTime}
                style={{ width: "100%", backgroundColor: "#FFFFFF" }}
                themeVariant="light"
                textColor="#334155"
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
