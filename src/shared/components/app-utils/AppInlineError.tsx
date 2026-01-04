import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Text, View } from 'react-native'

type AppInlineErrorProps = {
  message: string
}

const AppInlineError = ({ message }: AppInlineErrorProps) => {
  return (
    <View className="mb-4 rounded-lg bg-red-50 px-4 py-4 flex-row gap-3 justify-center items-center">
      <Ionicons name="alert-circle" size={20} color="#dc2626" style={{ marginTop: 1 }} />
      <Text className="flex-1 text-base text-error">{message}</Text>
    </View>
  )
}

export default AppInlineError
