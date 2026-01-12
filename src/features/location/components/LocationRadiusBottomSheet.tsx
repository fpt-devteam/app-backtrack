import { BottomSheet } from '@/src/shared/components'
import colors from '@/src/shared/theme/colors'
import Slider from '@react-native-community/slider'
import React, { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

type Props = {
  isVisible: boolean
  onClose: () => void
  radius: number
  onRadiusChange: (radius: number) => void
}

const LocationRadiusBottomSheet = ({
  isVisible,
  onClose,
  radius,
  onRadiusChange
}: Props) => {
  const [localRadius, setLocalRadius] = useState(radius)

  const onApplyRadius = () => {
    onRadiusChange(localRadius)
    onClose()
  }

  return (
    <BottomSheet isVisible={isVisible} onClose={onClose}>
      <View className="px-4 pb-5">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-base font-semibold text-gray-900">Search radius</Text>

          <View className="px-3 py-1 rounded-full bg-gray-100">
            <Text className="text-sm font-semibold text-gray-900">{localRadius} km</Text>
          </View>
        </View>

        {/* Slider */}
        <View className="px-2 py-3 rounded-2xl bg-gray-50">
          <View className="flex-row justify-between mb-2">
            <Text className="text-xs text-gray-500">1 km</Text>
            <Text className="text-xs text-gray-500">10 km</Text>
          </View>

          <Slider
            value={localRadius}
            onValueChange={(v) => setLocalRadius(Math.round(v))}
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
                <TouchableOpacity
                  key={v}
                  onPress={() => setLocalRadius(v)}
                  className={[
                    'px-3 py-2 rounded-xl',
                    active ? 'bg-gray-900' : 'bg-white border border-gray-200',
                  ].join(' ')}
                >
                  <Text className={active ? 'text-white text-xs font-semibold' : 'text-gray-900 text-xs font-semibold'}>{v} km</Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        {/* Actions */}
        <View className="flex-row justify-end gap-2 mt-4">
          <TouchableOpacity onPress={onApplyRadius} className="px-4 py-3 rounded-xl bg-primary">
            <Text className="text-white font-semibold">Apply</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} className="px-4 py-3 rounded-xl bg-gray-100">
            <Text className="text-gray-900 font-semibold">Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheet>
  )
}

export default LocationRadiusBottomSheet
