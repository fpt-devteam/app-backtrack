import { useUserCoordinates } from '@/src/features/map/hooks';
import colors from '@/src/shared/theme/colors';
import { NavigationArrowIcon } from 'phosphor-react-native';
import React from 'react';
import type { GestureResponderEvent } from 'react-native';
import { TouchableOpacity, View } from 'react-native';
import type { LatLng } from 'react-native-maps';

type UserPlaceButtonProps = {
  onPress: (data: LatLng) => void
  disabled: boolean
}

const UserPlaceButton = ({ onPress, disabled }: UserPlaceButtonProps) => {
  const { getUserCoordinates, loading } = useUserCoordinates()

  const handleOnPress = async (event: GestureResponderEvent) => {
    event.stopPropagation()
    const coord = await getUserCoordinates()
    if (!coord) return
    onPress(coord)
  }

  return (
    <View className="h-12 w-12 bg-white rounded-lg">
      <TouchableOpacity
        onPress={handleOnPress}
        disabled={disabled || loading}
        className="h-full w-full items-center justify-center"
      >
        <NavigationArrowIcon
          size={24}
          color={colors.black}
          style={{ transform: [{ rotate: '90deg' }] }}
        />
      </TouchableOpacity>
    </View>
  )
}
export default UserPlaceButton