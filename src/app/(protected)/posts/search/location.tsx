import { LocationMapUtils, LocationMapView } from '@/src/features/location/components'
import React from 'react'
import { Text, View } from 'react-native'

const LocationSearchScreen = () => {
  return (
    <View className="flex-1">
      {/* Location Map View */}
      <View className='relative flex-1'>
        <LocationMapView />
      </View>

      {/* Location SearchBar */}
      <View className='absolute top-0 left-0 right-0 bottom-0'>
        <Text>Location SearchBar</Text>
      </View>

      {/* Location Map Utils */}
      <View className='absolute top-0 right-0'>
        <LocationMapUtils />
      </View>
    </View>
  )
}

export default LocationSearchScreen
