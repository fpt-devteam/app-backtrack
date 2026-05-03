import type { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { CalendarBlankIcon } from "phosphor-react-native";
import React, { useMemo, useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { Nullable } from "../../types";
import { formatDateByPattern, parseToDate } from "../../utils";

type Props = Readonly<{
  label?: string;
  value: Nullable<string>;
  onChange: (next: Nullable<string>) => void;
  placeholder?: string;
  disabled?: boolean;
}>;

const MIN_DATE = new Date(2000, 0, 1);

export const DatePickerField = ({
  value,
  onChange,
  placeholder = "MM/dd/yyyy",
  disabled = false,
}: Props) => {
  const [open, setOpen] = useState(false);

  const safeDate = useMemo(() => {
    const parsed = parseToDate(value);
    if (!parsed) return new Date();
    return parsed;
  }, [value]);

  const displayText = useMemo(() => {
    if (!value) return placeholder;
    return formatDateByPattern(value, "MM/dd/yyyy");
  }, [value]);

  const openModal = () => {
    if (disabled) return;
    setOpen(true);
  };

  const onPressClose = () => {
    setOpen(false);
  };

  const onPressClear = () => {
    onChange(null);
  };

  const onPressDone = () => {
    onPressClose();
  };

  const onChangeDate = (
    event: DateTimePickerEvent,
    picked: Date | undefined,
  ) => {
    if (!picked) return;
    const dateOnlyStr = formatDateByPattern(picked, "yyyy-MM-dd");
    onChange(dateOnlyStr);
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
            <Text className="text-[13px] font-extrabold text-textSecondary mb-xs">
              Date
            </Text>

            <View className="rounded-md border border-border overflow-hidden bg-surface">
              <DateTimePicker
                value={safeDate}
                mode="date"
                display="spinner"
                onChange={onChangeDate}
                style={{ width: "100%" }}
                minimumDate={MIN_DATE}
                maximumDate={new Date()}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
