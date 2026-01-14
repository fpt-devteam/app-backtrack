import * as Haptics from 'expo-haptics'
import React from 'react'
import { View } from 'react-native'
import type { LatLng } from 'react-native-maps'
import { Circle, Marker } from 'react-native-maps'

type UserPlaceMarkerProps = {
  coordinate: LatLng
  disabled: boolean
  radiusKm: number
  onPress?: () => void
}

export default function UserPlaceMarker({
  coordinate,
  disabled,
  radiusKm,
  onPress,
}: Readonly<UserPlaceMarkerProps>) {

  const handlePress = () => {
    if (disabled) return
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined)
    onPress?.()
  }

  return (
    <View>
      <Circle
        center={coordinate}
        radius={radiusKm * 1000}
        zIndex={1}
        strokeWidth={2}
        strokeColor="rgba(0,122,255,0.8)"
        fillColor="rgba(0,122,255,0.12)"
      />

      <Marker
        coordinate={coordinate}
        focusable={!disabled}
        onPress={handlePress}
        zIndex={2}
      />
    </View>
  )
}
