import { Stack } from 'expo-router'
import React from 'react'

const MapLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  )
}

export default MapLayout
