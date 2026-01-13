import { LocationSearchBar } from "@/src/features/location/components";
import { useLocationSelectionStore } from "@/src/features/location/store";
import type {
  PlaceDetails,
  UserLocation
} from "@/src/features/location/types";
import { router } from "expo-router";
import React from "react";
import {
  Keyboard,
  TouchableWithoutFeedback
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LocationSearchScreen() {
  const { selection, onChangeSelection } = useLocationSelectionStore();

  const handleSelectPlace = (details: PlaceDetails, label: string) => {
    const data: UserLocation = {
      ...selection,
      location: details.location,
      displayAddress: label,
      externalPlaceId: details.placeId,
    }

    onChangeSelection(data);
    router.back();
  };

  const handleBackPress = () => {
    router.back();
  };

  return (
    <TouchableWithoutFeedback
      accessible={false}
      onPress={Keyboard.dismiss}>
      <SafeAreaView className="bg-white flex-1 p-4 ">
        <LocationSearchBar
          showBackButton
          initialQuery={selection?.displayAddress || ""}
          onBackPress={handleBackPress}
          onSelectPlace={handleSelectPlace}
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
