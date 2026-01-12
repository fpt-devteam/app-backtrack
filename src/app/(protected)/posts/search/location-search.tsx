import { LocationSearchBar } from "@/src/features/location/components";
import type {
  PlaceDetails
} from "@/src/features/location/services/googlePlaces.service";
import { useLocationSelectionStore } from "@/src/features/location/store";
import { router } from "expo-router";
import React from "react";
import {
  Keyboard,
  TouchableWithoutFeedback
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LocationSearchScreen() {
  const { setSelection } = useLocationSelectionStore();

  const getInitialQuery = () => {
    return '';
  }

  const handleSelectPlace = (details: PlaceDetails, label: string) => {
    setSelection({ location: details.location });
    console.log('Selected place details:', details);
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
          initialQuery={getInitialQuery()}
          onBackPress={handleBackPress}
          onSelectPlace={handleSelectPlace}
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
