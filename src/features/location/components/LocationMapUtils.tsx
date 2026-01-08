import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Modal from 'react-native-modal';

type Props = {
  radius?: number
  loadingLocate?: boolean
  onGetCurrentPosition?: () => void
  onChangeRadius?: (radius: number) => void
}

const LocationMapUtils = ({
  radius = 100,
  onChangeRadius,
  onGetCurrentPosition,
  loadingLocate = false,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [localRadius, setLocalRadius] = useState(radius);

  const handlePress = () => {
    setOpen(!open);
  };

  const handleBlur = () => {
    setOpen(false);
    console.log('Radius selected:', localRadius);
    onChangeRadius?.(localRadius);
  };

  return (
    <View>
      {/* Button Container */}
      <View>
        {/* Get current position */}
        <View className="h-12 w-12 bg-white rounded-lg" >
          <Pressable onPress={onGetCurrentPosition} className='h-full w-full items-center justify-center'>
            <Ionicons name="locate-sharp" size={24} color="black" disabled={loadingLocate} />
          </Pressable>
        </View>

        {/* Change radius */}
        <View className="h-12 w-12 bg-white rounded-lg" >
          <Pressable onPress={handlePress} className='h-full w-full items-center justify-center'>
            <MaterialCommunityIcons name="radius-outline" size={24} color="black" />
          </Pressable>
        </View>

        {/* Radius Slider Modal */}
        <Modal
          isVisible={open}
          onBackdropPress={handlePress}
          onBackButtonPress={handlePress}
          backdropOpacity={0.35}
          backdropColor="#000"
          style={{ margin: 0, justifyContent: 'flex-end' }}
          useNativeDriver
        >
          <View className="bg-white rounded-t-3xl px-4 pt-3 pb-5 shadow-lg">
            {/* Handle bar */}
            <View className="items-center mb-3">
              <View className="h-1.5 w-10 rounded-full bg-gray-300" />
            </View>

            {/* Header */}
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-base font-semibold text-gray-900">
                Search radius
              </Text>

              <View className="px-3 py-1 rounded-full bg-gray-100">
                <Text className="text-sm font-semibold text-gray-900">
                  {localRadius} km
                </Text>
              </View>
            </View>

            {/* Slider container */}
            <View className="px-2 py-3 rounded-2xl bg-gray-50">
              <View className="flex-row justify-between mb-2">
                <Text className="text-xs text-gray-500">1 km</Text>
                <Text className="text-xs text-gray-500">10 km</Text>
              </View>

              <Slider
                value={localRadius}
                onValueChange={setLocalRadius}
                onSlidingComplete={(v) => setLocalRadius(Math.round(v))}
                step={1}
                minimumValue={1}
                maximumValue={10}
                minimumTrackTintColor="#111827"
                maximumTrackTintColor="#D1D5DB"
                thumbTintColor="#111827"
              />

              {/* Quick picks */}
              <View className="flex-row gap-2 mt-3">
                {[1, 5, 10].map((v) => {
                  const active = localRadius === v
                  return (
                    <Pressable
                      key={v}
                      onPress={() => setLocalRadius(v)}
                      className={[
                        'px-3 py-2 rounded-xl',
                        active ? 'bg-gray-900' : 'bg-white border border-gray-200',
                      ].join(' ')}
                      style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.98 : 1 }] })}
                    >
                      <Text className={active ? 'text-white text-xs font-semibold' : 'text-gray-900 text-xs font-semibold'}>
                        {v} km
                      </Text>
                    </Pressable>
                  )
                })}
              </View>
            </View>

            {/* Actions */}
            <View className="flex-row justify-end gap-2 mt-4">
              <Pressable onPress={handleBlur} className="px-4 py-3 rounded-xl bg-primary" >
                <Text className="text-white font-semibold">Apply</Text>
              </Pressable>

              <Pressable onPress={handlePress} className="px-4 py-3 rounded-xl bg-gray-100">
                <Text className="text-gray-900 font-semibold">Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  )
}

export default LocationMapUtils
