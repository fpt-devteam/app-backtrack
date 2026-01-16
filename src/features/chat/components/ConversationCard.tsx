import { ConversationAvatar } from '@/src/features/chat/components/ConversationAvatar'
import { Conversation } from '@/src/features/chat/types'
import { CHAT_ROUTE } from '@/src/shared/constants/route.constant'
import { ExternalPathString, RelativePathString, router } from 'expo-router'
import React, { useMemo } from 'react'
import { Pressable, Text, View } from 'react-native'

type Props = {
  conversation: Conversation
}

const formatTime = (iso?: string) => {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  // simple "HH:mm" (local)
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${hh}:${mm}`
}

export const ConversationCard = ({ conversation }: Props) => {
  const partnerName = conversation.partner?.displayName || 'Unknown User'
  const lastText = conversation.lastMessage?.lastContent ?? 'Say hi'
  const timeText = useMemo(() => {
    return (
      formatTime(conversation.lastMessage?.timestamp) ||
      formatTime(conversation.updatedAt)
    )
  }, [conversation.lastMessage?.timestamp, conversation.updatedAt])

  const unread = conversation.unreadCount ?? 0
  const showUnread = unread > 0

  return (
    <Pressable
      onPress={() => {
        router.push(
          CHAT_ROUTE.message(conversation.conversationId) as ExternalPathString | RelativePathString
        )
      }}
      className="w-full p-4 mb-4"
      style={({ pressed }) => ({
        opacity: pressed ? 0.92 : 1,
        transform: [{ scale: pressed ? 0.99 : 1 }],
      })}
    >
      <View className="flex-row items-center">
        {/* Avatar */}
        <ConversationAvatar name={partnerName} />

        {/* Main content */}
        <View className="flex-1 ml-3">
          <View className="flex-row items-center">
            <Text
              className="flex-1 text-base font-semibold text-slate-900"
              numberOfLines={1}
            >
              {partnerName}
            </Text>

            {!!timeText && (
              <Text className="text-xs text-slate-500 ml-2">{timeText}</Text>
            )}
          </View>

          <View className="flex-row items-center mt-1">
            <Text
              className={`flex-1 text-sm text-slate-600`}
              numberOfLines={1}
            >
              {lastText}
            </Text>
          </View>
        </View>
      </View>

    </Pressable>
  )
}


