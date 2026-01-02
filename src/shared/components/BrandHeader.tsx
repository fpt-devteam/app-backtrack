import React from 'react'
import { Image, Text, View } from 'react-native'

const BrandHeader = () => {
  return (
    <View className="w-full items-center">
      {/* Logo */}
      <View className="items-center justify-center rounded-full">
        <Image
          source={require("@/assets/icons/logo.png")}
          className="h-16 w-16"
          resizeMode="contain"
        />
      </View>

      {/* App Name */}
      <Text className="mt-4 font-display text-2xl text-slate-900">
        Backtrack
      </Text>

      {/* Slogan */}
      <Text className="mt-2 text-center text-slate-500 text-sm leading-5">
        Find what matters. Log in to continue.
      </Text>
    </View>
  )
}

export default BrandHeader
