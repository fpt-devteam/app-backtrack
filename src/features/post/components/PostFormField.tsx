import { colors, metrics, typography } from "@/src/shared/theme";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef, useState } from "react";
import { Animated, TextInput, TextStyle, View } from "react-native";

type PostFormFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  type?: "default" | "email" | "phone";
};

export const PostFormField = ({
  label,
  value,
  onChange,
  onBlur,
  onFocus,
  type = "default",
}: PostFormFieldProps) => {
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
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const labelColor = colors.text.muted;

  const labelTop = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [18, 8],
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
      <View className="relative h-control-xl bg-surface pb-sm">
        <Animated.Text
          style={{
            position: "absolute",
            left: metrics.spacing.md2,
            top: labelTop,
            fontSize: labelFontSize,
            fontWeight: typography.fontWeight.thin as TextStyle["fontWeight"],
            color: labelColor,
          }}
        >
          {label}
        </Animated.Text>

        <Animated.View style={{ flex: 1, paddingTop: inputPaddingTop }}>
          <TextInput
            className="flex-1 px-md2"
            style={{
              color: colors.text.primary,
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.thin as TextStyle["fontWeight"],
            }}
            value={value}
            onChangeText={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            cursorColor={colors.black}
            selectionColor={colors.black}
            keyboardType={
              type === "email"
                ? "email-address"
                : type === "phone"
                  ? "phone-pad"
                  : "default"
            }
          />
        </Animated.View>
      </View>
    </View>
  );
};
