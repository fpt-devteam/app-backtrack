import { useAppUser } from '@/src/features/auth/providers/user.provider'
import { AppInlineError, AppLoader } from '@/src/shared/components'
import { toast } from '@/src/shared/components/ui/toast'
import { socketService } from '@/src/shared/services'
import React, { useCallback, useEffect, useMemo } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  View
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useConversationDetail, useMessages, useSendMessage } from '../hooks'
import { MessageItem } from '../types'
import ConversationHeader from './ConversationHeader'
import MessageInput from './MessageInput'
import MessageList from './MessageList'

interface ConversationDetailScreenProps {
  conversationId: string
}

const ConversationDetailScreen = ({ conversationId }: ConversationDetailScreenProps) => {
  const insets = useSafeAreaInsets();

  const { user } = useAppUser()
  const { sendMessage, isSendingMessage } = useSendMessage()
  const {
    data: conversationDetail,
    isLoading: isLoadingConversation,
  } = useConversationDetail(conversationId)
  const {
    data: messagesData,
    isLoading: isLoadingMessages,
    isError: isMessagesError,
    refetch: refetchMessages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMessages(conversationId)

  // Socket management
  useEffect(() => {
    if (!conversationId) return

    let cleanup: (() => void) | undefined

    const initSocket = async () => {
      try {
        await socketService.connect()
        socketService.joinConversation(conversationId)

        cleanup = socketService.onReceiveMessage((message: MessageItem) => {
          console.log('📨 New message received:', message)
          refetchMessages()
        })
      } catch (error) {
        console.error('Failed to initialize socket:', error)
      }
    }
    initSocket()

    return () => {
      if (cleanup) cleanup()
      socketService.leaveConversation(conversationId)
    }
  }, [conversationId, refetchMessages])

  const messages = useMemo<MessageItem[]>(() => {
    if (!messagesData || !user) return []
    return messagesData.map((message) => ({
      id: message.id,
      content: message.content,
      senderId: message.senderId,
      createdAt: message.createdAt,
      isMine: message.senderId === user.id,
    }))
  }, [messagesData, user])

  const handleLoadMore = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return
    fetchNextPage().catch(() => {
      console.log('Error fetching more messages')
    })
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const handleSendMessage = useCallback(
    async (messageText: string) => {
      if (!conversationId || !user) return

      try {
        await sendMessage({
          conversationId,
          request: { content: messageText },
        })
      } catch (error) {
        toast.error('Failed to send message. Please try again.');
        console.log('Error sending message:', error);
      }
    },
    [conversationId, user, sendMessage]
  )

  if (isLoadingMessages) {
    return (
      <View className="flex-1 bg-background-light">
        <ConversationHeader
          partnerName={conversationDetail?.partner.displayName}
          isLoading={isLoadingConversation}
        />
        <AppLoader />
      </View>
    )
  }

  if (isMessagesError) {
    return (
      <View className="flex-1 bg-background-light">
        <ConversationHeader
          partnerName={conversationDetail?.partner.displayName}
          isLoading={isLoadingConversation}
        />
        <AppInlineError message="Failed to load messages. Please try again." />
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background-light"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ConversationHeader
        partnerName={conversationDetail?.partner.displayName}
        isLoading={isLoadingConversation}
      />
      <MessageList
        messages={messages}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={handleLoadMore}
      />
      <View style={{ paddingBottom: insets.bottom }}>

        <MessageInput onSend={handleSendMessage} isSending={isSendingMessage} />
      </View>
    </KeyboardAvoidingView>
  )
}

export default ConversationDetailScreen
