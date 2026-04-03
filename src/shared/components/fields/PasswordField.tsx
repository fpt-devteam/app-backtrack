import { colors } from "@/src/shared/theme";
import * as Haptics from "expo-haptics";
import { EyeIcon, EyeSlashIcon, LockIcon } from "phosphor-react-native";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

type PasswordFieldProps = {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
};

export const PasswordField = ({
  value,
  onChange,
  onBlur,
  error,
}: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleShowPasswordToggle = () => {
    setShowPassword((prev) => !prev);
  };

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
        Password
      </Text>

      {/* Field */}
      <View
        className={`flex-row gap-2 items-center rounded-sm border p-3`}
        style={{
          borderWidth: 1,
          borderColor: getColor(),
        }}
      >
        {/* Password Icon */}
        <LockIcon size={20} color={getColor()} />

        {/* Password Text */}
        <TextInput
          className="flex-1"
          style={{ color: colors.text.main }}
          placeholder="***********"
          placeholderTextColor={colors.slate[400]}
          clearTextOnFocus={true}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoCorrect={false}
          value={value}
          onChangeText={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />

        {/* Password Show Toggle */}
        <TouchableOpacity onPress={handleShowPasswordToggle} hitSlop={12}>
          {showPassword ? (
            <EyeIcon size={20} color={getColor()} />
          ) : (
            <EyeSlashIcon size={20} color={getColor()} />
          )}
        </TouchableOpacity>
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
