import { useLocationSelectionStore } from "@/src/features/map/store";
import type { UserLocation } from "@/src/features/map/types";
import { POST_ROUTE } from "@/src/shared/constants";
import { colors } from "@/src/shared/theme/colors";
import * as Haptics from "expo-haptics";
import { RelativePathString, router } from "expo-router";
import { CrosshairSimpleIcon } from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

type LocationFieldProps = {
  label?: string;
  placeholder?: string;
  value: UserLocation;
  onChange: (value: UserLocation) => void;
};

export const LocationField = ({
  value,
  onChange,
  label = "Location",
  placeholder = "Search location...",
}: LocationFieldProps) => {
  const [pressed, setPressed] = useState(false);
  const { reset, onConfirmSelection, confirmedSelection } =
    useLocationSelectionStore();

  useEffect(() => {
    if (!value) return;
    reset();
    onConfirmSelection(value);
  }, []);

  useEffect(() => {
    if (!confirmedSelection) return;
    onChange(confirmedSelection);
  }, [confirmedSelection, onChange]);

  const handlePress = () =>
    router.push(POST_ROUTE.searchLocation as RelativePathString);

  const handlePressIn = () => {
    setPressed(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(
      () => undefined,
    );
  };

  const displayText = value?.displayAddress ?? placeholder;

  return (
    <View style={{ marginTop: 8 }}>
      {/* Floating label overlapping the border */}
      <Text
        style={{
          top: -9,
          left: 12,
          zIndex: 1,
        }}
        className="absolute text-xs px-2 bg-surface "
      >
        {label}
      </Text>

      <TouchableOpacity
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={() => setPressed(false)}
        activeOpacity={0.9}
        style={{
          borderColor: pressed ? colors.primary : colors.slate[300],
          minHeight: 44,
          borderWidth: 1,
        }}
        className="flex-row gap-4 px-3 rounded-sm items-center"
      >
        <CrosshairSimpleIcon size={20} color={colors.primary} weight="bold" />

        <Text
          numberOfLines={1}
          style={{
            flex: 1,
            color: colors.slate[500],
          }}
          className="text-xs"
        >
          {displayText}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
