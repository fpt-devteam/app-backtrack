import { usePostCreationStore } from "@/src/features/post/hooks";
import { colors, metrics, typography } from "@/src/shared/theme";
import * as Haptics from "expo-haptics";
import { MotiView } from "moti";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Switch,
  Text,
  TextInput,
  TextStyle,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const PhoneForm = () => {
  const electronicDetail = usePostCreationStore(
    (state) => state.electronicDetail,
  );
  const setElectronicBrand = usePostCreationStore(
    (state) => state.setElectronicBrand,
  );
  const setElectronicModel = usePostCreationStore(
    (state) => state.setElectronicModel,
  );
  const setElectronicColor = usePostCreationStore(
    (state) => state.setElectronicColor,
  );
  const setElectronicScreenCondition = usePostCreationStore(
    (state) => state.setElectronicScreenCondition,
  );
  const setElectronicLockScreenDescription = usePostCreationStore(
    (state) => state.setElectronicLockScreenDescription,
  );
  const setElectronicHasCase = usePostCreationStore(
    (state) => state.setElectronicHasCase,
  );
  const setElectronicCaseDescription = usePostCreationStore(
    (state) => state.setElectronicCaseDescription,
  );
  const setElectronicDistinguishingFeatures = usePostCreationStore(
    (state) => state.setElectronicDistinguishingFeatures,
  );

  const hasCase = electronicDetail.hasCase ?? false;

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-surface"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          className="flex-1 p-lg"
          contentContainerClassName="gap-lg pb-xl"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View>
            <Text className="text-textPrimary font-normal text-2xl pr-lg tracking-tight">
              What does it look like?
            </Text>
            <Text className="text-textSecondary font-thin text-base mt-xs">
              The more unique traits you provide, the faster our AI can track it
              down.
            </Text>
          </View>

          {/* Identification */}
          <View className="border rounded-md overflow-hidden">
            <FormField
              label="Device Brand"
              value={electronicDetail.brand ?? ""}
              onChange={setElectronicBrand}
            />

            <View className="border-t" />

            <FormField
              label="Model Name"
              value={electronicDetail.model ?? ""}
              onChange={setElectronicModel}
            />

            <View className="border-t" />

            <FormField
              label="Primary Color"
              value={electronicDetail.color ?? ""}
              onChange={setElectronicColor}
            />

            <View className="border-t" />

            <FormField
              label="Screen & Glass condition"
              value={electronicDetail.screenCondition ?? ""}
              onChange={setElectronicScreenCondition}
            />

            <View className="border-t" />

            <FormField
              label="Wallpaper / Lock screen"
              value={electronicDetail.lockScreenDescription ?? ""}
              onChange={setElectronicLockScreenDescription}
            />
          </View>

          {/* Case Information */}
          <View>
            <View className="flex-row items-center justify-between mb-sm">
              <Text className="text-textPrimary font-normal text-lg pr-lg tracking-tight">
                Is it in a case?
              </Text>
              <Switch
                value={hasCase}
                onValueChange={setElectronicHasCase}
                trackColor={{ false: colors.white, true: colors.secondary }}
              />
            </View>

            <MotiView
              from={{ opacity: 0, height: 0 }}
              animate={{
                height: hasCase ? 50 : 0,
                opacity: hasCase ? 1 : 0,
              }}
            >
              <View className="border-t-[0.5px] border-divider" />

              <View className="border rounded-sm overflow-hidden">
                <FormField
                  label="Case colors, materials or stickers"
                  value={electronicDetail.caseDescription ?? ""}
                  onChange={setElectronicCaseDescription}
                />
              </View>
            </MotiView>
          </View>

          {/* Unique marks & traits*/}
          <View className="gap-sm">
            <Text className="text-textPrimary font-normal text-lg pr-lg tracking-tight">
              Unique marks & traits
            </Text>

            <View
              className="w-full bg-surface rounded-md border"
              style={{ minHeight: 128 }}
            >
              <TextInput
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                className="flex-1 p-md2 text-textPrimary font-thin"
                value={electronicDetail.distinguishingFeatures ?? ""}
                onChangeText={setElectronicDistinguishingFeatures}
                placeholder="Think of anything unique: a specific dent, a phone charm, or a custom engraving."
                placeholderTextColor={colors.text.muted}
                cursorColor={colors.primary}
              />
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

type FormFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
};

const FormField = ({
  label,
  value,
  onChange,
  onBlur,
  onFocus,
}: FormFieldProps) => {
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
          />
        </Animated.View>
      </View>
    </View>
  );
};

export default PhoneForm;
