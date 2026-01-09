import BottomSheet from '@/src/shared/components/ui/BottomSheet';
import { colors } from '@/src/shared/theme';
import Slider from '@react-native-community/slider';
import { Crosshair, Target } from 'phosphor-react-native';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

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
          <Pressable onPress={onGetCurrentPosition} disabled={loadingLocate} className='h-full w-full items-center justify-center'>
            <Crosshair size={24} color={colors.black} />
          </Pressable>
        </View>

        {/* Change radius */}
        <View className="h-12 w-12 bg-white rounded-lg" >
          <Pressable onPress={handlePress} className='h-full w-full items-center justify-center'>
            <Target size={24} color={colors.black} />
          </Pressable>
        </View>

        {/* Radius Slider Bottom Sheet */}
        <BottomSheet isVisible={open} onClose={handlePress}>
          <View className="px-4 pb-5">
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
                minimumTrackTintColor={colors.gray[900]}
                maximumTrackTintColor={colors.gray[300]}
                thumbTintColor={colors.gray[900]}
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
        </BottomSheet>
      </View>
    </View>
  )
}

export default LocationMapUtils
