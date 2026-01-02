import { formatDateTime } from "@/src/shared/utils";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import React, { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  Text,
  View
} from "react-native";

type Props = Readonly<{
  label?: string;
  value: Date | null;
  onChange: (next: Date | null) => void;
  placeholder?: string;
  disabled?: boolean;
}>;

const DATE_TIME_VALIDATE = {
  minDate: new Date(2000, 0, 1),
  maxDate: new Date(),
};

const DateTimePickerField = ({
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
    setOpen(true);
    setTemp(value ?? new Date());
  };

  const onPressDone = () => {
    if (temp.getTime() > DATE_TIME_VALIDATE.maxDate.getTime()) {
      setError("Date and time cannot be in the future.");
      return;
    }

    if (temp.getTime() < DATE_TIME_VALIDATE.minDate.getTime()) {
      setError("Date and time cannot be before Jan 1, 2000.");
      return;
    }

    setError(null);
    onChange(temp);
    onPressClose();
  };

  const onPressClose = () => {
    setOpen(false);
    setError(null);
  };

  const onPressClear = () => {
    onChange(null);
    onPressClose();
  };

  const onChangeDate = (event: DateTimePickerEvent, picked: Date | undefined) => {
    if (!picked) return;
    setTemp((prev) => {
      const next = new Date(prev);
      next.setFullYear(picked.getFullYear(), picked.getMonth(), picked.getDate());
      return next;
    });
  };

  const onChangeTime = (event: DateTimePickerEvent, picked: Date | undefined) => {
    if (!picked) return;
    setTemp((prev) => {
      const next = new Date(prev);
      next.setHours(picked.getHours(), picked.getMinutes(), 0, 0);
      return next;
    });
  };

  return (
    <View className="border-blue-500">
      <Pressable
        onPress={openModal}
        disabled={disabled}
        className="h-[52px] rounded-[14px] border border-[rgba(9,63,189,0.14)] bg-white px-3.5 flex-row items-center gap-3"
      >
        <Ionicons name="calendar-outline" size={18} color="#94A3B8" />
        <Text
          className={`text-[15px] ${value ? 'text-slate-900' : 'text-slate-400'}`}
          numberOfLines={1}
        >
          {displayText}
        </Text>
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={onPressClose}>
        <Pressable className="flex-1 bg-[rgba(15,23,42,0.35)]" onPress={onPressClose} />

        {error && (
          <View className="absolute top-[50px] left-5 right-5 bg-red-400 p-2.5 rounded-lg z-[1000]">
            <Text className="text-white font-bold text-center">{error}</Text>
          </View>
        )}

        <View className="absolute left-3.5 right-3.5 bottom-4 rounded-[18px] bg-white border border-[rgba(15,23,42,0.10)] p-3">
          {/* Header */}
          <View className="px-1.5 pt-1 pb-2.5">
            <View className="flex-row justify-end flex-wrap">
              {/* Clear button */}
              <Pressable
                onPress={onPressClear}
                className="px-3 py-2 rounded-xl border border-[rgba(15,23,42,0.10)] bg-white ml-2.5 mb-2"
              >
                <Text className="text-[13px] font-bold text-slate-900">Clear</Text>
              </Pressable>

              {/* Cancel button */}
              <Pressable
                onPress={onPressClose}
                className="px-3 py-2 rounded-xl border border-[rgba(15,23,42,0.10)] bg-white ml-2.5 mb-2"
              >
                <Text className="text-[13px] font-bold text-slate-900">Cancel</Text>
              </Pressable>

              {/* Done button */}
              <Pressable
                onPress={onPressDone}
                className="px-3 py-2 rounded-xl border border-[rgba(14,165,233,0.35)] bg-sky-500 ml-2.5 mb-2"
              >
                <Text className="text-[13px] font-extrabold text-white">Done</Text>
              </Pressable>
            </View>
          </View>

          {/* Date Picker */}
          <View className="px-1.5 pb-2.5">
            <Text className="text-[13px] font-extrabold text-slate-600 mb-1.5">Date</Text>
            <View className="rounded-[14px] border border-[rgba(15,23,42,0.10)] overflow-hidden bg-white">
              <DateTimePicker
                value={temp}
                mode="date"
                display="spinner"
                onChange={onChangeDate}
                style={{ width: '100%', backgroundColor: '#FFFFFF' }}
                themeVariant="light"
                textColor="#334155"
              />
            </View>
          </View>

          {/* Time Picker */}
          <View className="px-1.5 pb-2.5">
            <Text className="text-[13px] font-extrabold text-slate-600 mb-1.5">Time</Text>
            <View className="rounded-[14px] border border-[rgba(15,23,42,0.10)] overflow-hidden bg-white">
              <DateTimePicker
                value={temp}
                mode="time"
                display="spinner"
                is24Hour
                onChange={onChangeTime}
                style={{ width: '100%', backgroundColor: '#FFFFFF' }}
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

export default DateTimePickerField;

