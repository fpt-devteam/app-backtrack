import { colors, metrics, typography } from "@/src/shared/theme";
import * as Haptics from "expo-haptics";
import { WarningCircleIcon } from "phosphor-react-native";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Text, TextInput, type TextInputProps, View } from "react-native";

type BaseInputFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string | null;
  keyboardType?: TextInputProps["keyboardType"];
  textContentType?: TextInputProps["textContentType"];
  autoComplete?: TextInputProps["autoComplete"];
  autoCapitalize?: TextInputProps["autoCapitalize"];
  autoCorrect?: boolean;
  returnKeyType?: TextInputProps["returnKeyType"];
  secureTextEntry?: boolean;
  editable?: boolean;
  maxLength?: number;
  onSubmitEditing?: TextInputProps["onSubmitEditing"];
};

export const BaseInputField = ({
  label,
  value,
  onChange,
  onBlur,
  error,
  keyboardType = "default",
  textContentType,
  autoComplete = "off",
  autoCapitalize = "none",
  autoCorrect = false,
  returnKeyType = "next",
  secureTextEntry,
  editable = true,
  maxLength,
  onSubmitEditing,
}: BaseInputFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const isActive = isFocused || value.length > 0;

  const labelAnim = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(labelAnim, {
      toValue: isActive ? 1 : 0,
      duration: metrics.motion.duration.normal,
      useNativeDriver: false,
    }).start();
  }, [isActive, labelAnim]);

  const handleFocus = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const borderColor = error
    ? colors.status.error
    : isFocused
      ? colors.border.strong
      : colors.border.DEFAULT;

  const labelColor = error ? colors.status.error : colors.text.muted;

  const labelTop = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 6],
  });

  const labelFontSize = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [typography.fontSize.base, typography.fontSize.xs],
  });

  const inputPaddingTop = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 22],
  });

  return (
    <View>
      <View
        className="relative h-control-xl rounded-sm bg-surface pb-2"
        style={{ borderWidth: isFocused ? 2 : 1, borderColor }}
      >
        <Animated.Text
          style={{
            position: "absolute",
            left: metrics.spacing.md2,
            top: labelTop,
            fontSize: labelFontSize,
            fontWeight: "400",
            color: labelColor,
          }}
          numberOfLines={1}
        >
          {label}
        </Animated.Text>

        <Animated.View style={{ flex: 1, paddingTop: inputPaddingTop }}>
          <TextInput
            className="flex-1 px-md2"
            style={{
              color: colors.text.primary,
              fontSize: typography.fontSize.base,
              fontWeight: "400",
            }}
            value={value}
            onChangeText={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            keyboardType={keyboardType}
            textContentType={textContentType}
            autoComplete={autoComplete}
            autoCapitalize={autoCapitalize}
            autoCorrect={autoCorrect}
            returnKeyType={returnKeyType}
            secureTextEntry={secureTextEntry}
            editable={editable}
            maxLength={maxLength}
            onSubmitEditing={onSubmitEditing}
            cursorColor={colors.black}
            selectionColor={colors.black}
          />
        </Animated.View>
      </View>

      {error && (
        <View className="flex-row items-center mt-1.5 gap-2">
          <WarningCircleIcon size={16} weight="fill" color={colors.status.error} />
          <Text
            style={{
              fontSize: typography.fontSize.xs,
              fontWeight: "400",
              color: colors.status.error,
            }}
          >
            {error}
          </Text>
        </View>
      )}
    </View>
  );
};
