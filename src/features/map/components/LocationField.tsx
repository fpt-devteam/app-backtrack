import { useLocationSelectionStore } from "@/src/features/map/store";
import type { UserLocation } from "@/src/features/map/types";
import { POST_ROUTE } from "@/src/shared/constants";
import { colors } from "@/src/shared/theme/colors";
import * as Haptics from "expo-haptics";
import { RelativePathString, router } from "expo-router";
import { CaretRightIcon, MapPinIcon } from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity } from "react-native";

type LocationFieldProps = {
  placeholder?: string;
  value: UserLocation;
  onChange: (value: UserLocation) => void;
};

export const LocationField = ({
  value,
  onChange,
  placeholder = "Search location...",
}: LocationFieldProps) => {
  const [pressed, setPressed] = useState(false);
  const { reset, onConfirmSelection, confirmedSelection } =
    useLocationSelectionStore();

  useEffect(() => {
    if (!value) return;
    reset();
    onConfirmSelection(value);
    return () => reset();
  });

  useEffect(() => {
    if (!confirmedSelection) return;
    onChange(confirmedSelection);
    console.log("Data at field: ", confirmedSelection);
  }, [confirmedSelection]);

  const handlePress = () =>
    router.push(POST_ROUTE.searchLocation as RelativePathString);

  const displayText = value ? value.displayAddress : placeholder;

  const handlePressIn = () => {
    setPressed(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(
      () => undefined,
    );
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={() => setPressed(false)}
      activeOpacity={0.9}
      className={[
        "border rounded-xl p-3 min-h-[40px] flex-row items-center bg-white shadow-sm shadow-black/10",
        pressed ? "border-slate-300 bg-slate-50" : "border-slate-200",
      ].join(" ")}
    >
      <MapPinIcon size={18} color={colors.slate[400]} />
      <Text className="flex-1 ml-4 text-sm text-slate-400" numberOfLines={2}>
        {displayText}
      </Text>
      <CaretRightIcon size={18} color={colors.slate[400]} />
    </TouchableOpacity>
  );
};
