import { formatDateTime } from "@/src/shared/utils/datetime.utils";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import React, { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  Text,
  View
} from "react-native";
import styles from "./styles";


type Props = Readonly<{
  label?: string;
  value: Date | null;
  onChange: (next: Date | null) => void;
  placeholder?: string; // "mm/dd/yyyy, --:--"
  disabled?: boolean;
}>;

const dateTimeValidate = {
  minDate: new Date(2000, 0, 1),
  maxDate: new Date(),
};


export default function DateTimePickerField({
  value,
  onChange,
  placeholder = "mm/dd/yyyy, --:--",
  disabled = false,
}: Props) {
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
    if (temp.getTime() > dateTimeValidate.maxDate.getTime()) {
      setError("Date and time cannot be in the future.");
      return;
    }

    if (temp.getTime() < dateTimeValidate.minDate.getTime()) {
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
    <View style={styles.wrapper}>
      <Pressable
        onPress={openModal}
        disabled={disabled}
        style={styles.input}
      >
        <Ionicons name="calendar-outline" size={18} color="#94A3B8" />
        <Text style={[styles.valueText, !value && styles.placeholderText]} numberOfLines={1}>{displayText}</Text>
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={onPressClose}>
        <Pressable style={styles.backdrop} onPress={onPressClose} />

        {error && (
          <View style={[styles.errorBox]}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.sheetHeader}>
            <View style={styles.headerActions}>
              {/* Clear button */}
              <Pressable onPress={onPressClear} style={styles.headerBtn}>
                <Text style={styles.headerBtnTextSecondary}>Clear</Text>
              </Pressable>

              {/* Cancel button */}
              <Pressable onPress={onPressClose} style={styles.headerBtn}>
                <Text style={styles.headerBtnTextSecondary}>Cancel</Text>
              </Pressable>

              {/* Done button */}
              <Pressable onPress={onPressDone} style={[styles.headerBtn, styles.doneBtn]}>
                <Text style={styles.headerBtnTextPrimary}>Done</Text>
              </Pressable>
            </View>
          </View>

          {/* Date Picker */}
          <View style={styles.pickerBlock}>
            <Text style={styles.sectionLabel}>Date</Text>
            <View style={styles.pickerCard}>
              <DateTimePicker
                value={temp}
                mode="date"
                display="spinner"
                onChange={onChangeDate}
                style={styles.picker}
                themeVariant="light"
                textColor="#334155"
              />
            </View>
          </View>

          {/* Time Picker */}
          <View style={styles.pickerBlock}>
            <Text style={styles.sectionLabel}>Time</Text>
            <View style={styles.pickerCard}>
              <DateTimePicker
                value={temp}
                mode="time"
                display="spinner"
                is24Hour
                onChange={onChangeTime}
                style={styles.picker}
                themeVariant="light"
                textColor="#334155"
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

