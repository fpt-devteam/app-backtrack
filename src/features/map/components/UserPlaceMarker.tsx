import * as Haptics from 'expo-haptics'
import React from 'react'
import type { LatLng } from 'react-native-maps'
import { Circle, Marker } from 'react-native-maps'

type UserPlaceMarkerProps = {
  coordinate: LatLng
  disabled: boolean
  radiusKm?: number
  showRadius?: boolean
  onPress?: () => void
}

const DEFAULT_RADIUS_KM = 5

export default function UserPlaceMarker({
  coordinate,
  disabled,
  radiusKm = DEFAULT_RADIUS_KM,
  showRadius = true,
  onPress,
}: Readonly<UserPlaceMarkerProps>) {

  const handlePress = () => {
    if (disabled) return
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined)
    onPress?.()
  }

  console.log("Rendering UserPlaceMarker at", coordinate, "with radiusKm =", radiusKm, "showRadius =", showRadius)

  return (
    <>
      {showRadius &&
        <Circle
          center={coordinate}
          radius={radiusKm * 1000}
          zIndex={1}
          strokeWidth={2}
          strokeColor="rgba(0,122,255,0.8)"
          fillColor="rgba(0,122,255,0.12)"
        />
      }

      <Marker
        key={`${coordinate.latitude},${coordinate.longitude}`}
        coordinate={coordinate}
        focusable={!disabled}
        onPress={handlePress}
        zIndex={2}
      />
    </>
  )
}
