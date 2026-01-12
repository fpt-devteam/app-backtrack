import type { UserLocation } from '@/src/features/location/types'
import { POST_ROUTE } from '@/src/shared/constants'
import colors from '@/src/shared/theme/colors'
import * as Haptics from 'expo-haptics'
import { router } from 'expo-router'
import { CaretRightIcon, MapPinIcon } from 'phosphor-react-native'
import React, { useEffect, useState } from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { usePlaceDetailsFromLatLngMutation } from '../hooks/usePlaceDetails'
import { useLocationSelectionStore } from '../store'

type LocationFieldProps = {
  placeholder?: string;
  value: UserLocation
  onChange: (value: UserLocation) => void
}

const LocationField = ({
  value,
  onChange,
  placeholder = 'Search location...'
}: LocationFieldProps) => {
  const [pressed, setPressed] = useState(false)
  const { selection, initSelection, clearSelection } = useLocationSelectionStore();
  const placeMut = usePlaceDetailsFromLatLngMutation();

  useEffect(() => {
    initSelection();
    // return () => clearSelection();
  }, [initSelection]);

  useEffect(() => {
    console.log("Here to normalize data after selection");
    console.log('Location selection changed at here:', selection);

    const normData = async () => {
      if (selection) {
        const details = await placeMut.mutateAsync({ loc: selection.location });
        if (details) {
          console.log('Fetched place details:', details);
          onChange({
            displayAddress: details.formattedAddress || '',
            location: details.location,
            externalPlaceId: details.placeId,
          });
        }
      }
    }
    normData()
  }, [selection]);

  const handlePress = () => {
    console.log('Navigate to location search screen');
    router.push(POST_ROUTE.searchLocation);
  };

  const displayText = value ? value.displayAddress : placeholder;

  const handlePressIn = () => {
    setPressed(true)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined)
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={() => setPressed(false)}
      activeOpacity={0.9}
      className={[
        "border rounded-sm p-3 flex-row items-center bg-white shadow-sm shadow-black/10",
        pressed ? "border-slate-300 bg-slate-50" : "border-slate-200",
      ].join(" ")}
    >
      <MapPinIcon size={18} color={colors.slate[400]} />
      <Text className="flex-1 ml-4 text-sm text-slate-400" numberOfLines={2}>{displayText}</Text>
      <CaretRightIcon size={18} color={colors.slate[400]} />
    </TouchableOpacity>
  )
}

export default LocationField
