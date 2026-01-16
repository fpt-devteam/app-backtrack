import { colors } from '@/src/shared/theme'
import { useRouter } from 'expo-router'
import { ArrowLeftIcon } from 'phosphor-react-native'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

interface ConversationHeaderProps {
  partnerName?: string | null
  isLoading?: boolean
}

export const ConversationHeader = ({ partnerName, isLoading }: ConversationHeaderProps) => {
  const router = useRouter()

  return (
    <View className="bg-white border-b border-slate-200 px-4 py-3 flex-row items-center">
      <TouchableOpacity onPress={() => router.back()} className="mr-3">
        <ArrowLeftIcon size={24} color={colors.slate[500]} />
      </TouchableOpacity>
      <View className="flex-1">
        {isLoading ? (
          <Text className="text-slate-400">Loading...</Text>
        ) : (
          <Text className="font-semibold text-lg text-slate-900">
            {partnerName || 'Chat'}
          </Text>
        )}
      </View>
    </View>
  )
}


