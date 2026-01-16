import { colors } from '@/src/shared/theme'
import { PaperPlaneRightIcon } from 'phosphor-react-native'
import React, { useState } from 'react'
import { ActivityIndicator, TextInput, TouchableOpacity, View } from 'react-native'

interface MessageInputProps {
  onSend: (message: string) => Promise<void>
  isSending?: boolean
}

export const MessageInput = ({ onSend, isSending }: MessageInputProps) => {
  const [messageText, setMessageText] = useState('')

  const handleSend = async () => {
    if (!messageText.trim() || isSending) return

    const currentMessage = messageText.trim()
    setMessageText('')

    try {
      await onSend(currentMessage)
    } catch (error) {
      setMessageText(currentMessage);
      console.log('Error sending message:', error)
    }
  }

  return (
    <View className="bg-white border-t border-slate-200 px-4 py-3 mb-4">
      <View className="flex-row items-center gap-3">
        <View className="flex-1 min-h-[40px] max-h-[120px] bg-slate-50 rounded-lg px-3 py-2 border border-slate-200">
          <TextInput
            value={messageText}
            onChangeText={setMessageText}
            placeholder="Type a message..."
            placeholderTextColor={colors.slate[400]}
            multiline
            className="text-slate-900 text-base flex-1"
            textAlignVertical="center"
          />
        </View>

        <TouchableOpacity
          onPress={handleSend}
          disabled={!messageText.trim() || isSending}
          className={`w-10 h-10 rounded-lg items-center justify-center ${messageText.trim() && !isSending ? 'bg-primary' : 'bg-slate-300'
            }`}
        >
          {isSending ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <PaperPlaneRightIcon size={18} color="white" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  )
}


