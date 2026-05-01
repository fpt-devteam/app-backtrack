import { colors, metrics, typography } from "@/src/shared/theme";
import * as Haptics from "expo-haptics";
import { EyeClosedIcon, EyeIcon } from "phosphor-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
} from "react-native";

type PostFormFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  type?: "default" | "email-address" | "phone-pad" | "password"; // Added password type
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
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Added state for password visibility
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

  const togglePasswordVisibility = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsPasswordVisible(!isPasswordVisible);
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

  const isSecure = type === "password" && !isPasswordVisible;

  return (
    <View>
      <View className="relative h-control-xl bg-surface pb-sm flex-row items-center">
        <View className="flex-1">
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
                fontWeight: typography.fontWeight
                  .thin as TextStyle["fontWeight"],
              }}
              value={value}
              onChangeText={onChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              cursorColor={colors.black}
              selectionColor={colors.black}
              keyboardType={type === "password" ? "default" : type}
              secureTextEntry={isSecure}
              autoCapitalize={type === "password" ? "none" : undefined}
              autoCorrect={type === "password" ? false : undefined}
            />
          </Animated.View>
        </View>

        {type === "password" && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            className="px-md2 justify-center items-center h-full pt-2"
            activeOpacity={0.7}
          >
            {isPasswordVisible ? (
              <EyeClosedIcon size={20} color={colors.text.muted} />
            ) : (
              <EyeIcon size={20} color={colors.text.muted} />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
