import { colors } from "@/src/shared/theme";
import * as Haptics from "expo-haptics";
import { EnvelopeIcon } from "phosphor-react-native";
import React, { useState } from "react";
import { Text, TextInput, View } from "react-native";

type EmailFieldProps = {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
};

export const EmailField = ({
  value,
  onChange,
  onBlur,
  error,
}: EmailFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const getColor = () => {
    if (error) return colors.text.error;
    if (isFocused) return colors.primary;
    return colors.slate[400];
  };

  return (
    <View>
      {/* Field Label */}
      <Text
        className="mb-2 text-base font-medium"
        style={{
          color: colors.text.main,
        }}
      >
        Email
      </Text>

      {/* Field */}
      <View
        className={`flex-row gap-2 items-center rounded-lg border p-3`}
        style={{
          borderWidth: 1,
          borderColor: getColor(),
        }}
      >
        {/* Email Icon */}
        <EnvelopeIcon size={20} color={getColor()} />

        {/* Email Text */}
        <TextInput
          className="flex-1"
          style={{ color: colors.text.main }}
          placeholder="user@example.com"
          placeholderTextColor={colors.slate[400]}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={value}
          onChangeText={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </View>

      {/* Text Error */}
      {error && (
        <View className="flex-row items-center mt-1.5 px-1">
          <Text
            className="text-sm text-error"
            style={{ color: colors.text.error }}
          >
            {error}
          </Text>
        </View>
      )}
    </View>
  );
};
