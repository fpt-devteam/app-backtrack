import { useLocationSelectionStore } from "@/src/features/location/store"
import type {
  PlaceDetails,
  UserLocation
} from "@/src/features/location/types"
import { MapSearchBar } from "@/src/features/map/components"
import { MAP_ROUTE } from "@/src/shared/constants"
import { router } from "expo-router"
import React from "react"
import {
  Keyboard,
  TouchableWithoutFeedback
} from "react-native"

export default function LocationSearchScreen() {
  const { selection, onChangeSelection } = useLocationSelectionStore()

  const handleSelectPlace = (details: PlaceDetails, label: string) => {
    const data: UserLocation = {
      ...selection,
      location: details.location,
      displayAddress: label,
      externalPlaceId: details.placeId,
    }

    onChangeSelection(data)
    handleBack()
  }

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back()
    }
    else {
      router.replace(MAP_ROUTE.index)
      console.log("Can not go back, replacing to map index")
    }
  }

  return (
    <TouchableWithoutFeedback
      accessible={false}
      onPress={Keyboard.dismiss}>
      <MapSearchBar
        showBackButton
        initialQuery={selection?.displayAddress || ""}
        onBackPress={handleBack}
        onSelectPlace={handleSelectPlace}
      />
    </TouchableWithoutFeedback>
  )
}
