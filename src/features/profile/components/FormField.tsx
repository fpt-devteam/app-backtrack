import { colors } from "@/src/shared/theme";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { Text, TextInput, View } from "react-native";

type FormFieldProps = {
  value: string;
  placeholder: string;
  label: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
};

export const FormField = ({
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
}: FormFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const getBorderColor = () => {
    if (error) return colors.text.error;
    if (isFocused) return colors.secondary;
    return colors.divider;
  };

  return (
    <View className="py-md">
      <Text className="text-base font-semibold text-textPrimary mb-sm">
        {label}
      </Text>

      <TextInput
        className="text-base text-textPrimary rounded-lg px-md py-sm"
        style={{ borderWidth: 1, borderColor: getBorderColor() }}
        placeholder={placeholder}
        placeholderTextColor={colors.slate[400]}
        autoCapitalize="none"
        autoCorrect={false}
        value={value}
        onChangeText={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />

      {error ? (
        <Text
          className="text-sm mt-xs px-xs"
          style={{ color: colors.text.error }}
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
};
