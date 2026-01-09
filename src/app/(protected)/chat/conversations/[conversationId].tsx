import { useAppUser } from '@/src/features/auth/providers/user.provider'
import MessageItemCard from '@/src/features/chat/components/MessageItemCard'
import { useMessages, useSendMessage } from '@/src/features/chat/hooks'
import { MessageItem } from '@/src/features/chat/types'
import { socketService } from '@/src/shared/services'
import { colors } from '@/src/shared/theme'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { ArrowLeft, PaperPlaneRight, WarningCircle } from 'phosphor-react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'

// Components for list rendering
const LoadingFooterComponent = ({ isFetchingNextPage }: { isFetchingNextPage: boolean }) => {
  if (!isFetchingNextPage) return null

  return (
    <View className="py-4 items-center">
      <ActivityIndicator size="small" color={colors.blue[500]} />
      <Text className="mt-2 text-slate-500 text-sm">Loading more messages...</Text>
    </View>
  )
}

export default function ConversationScreen() {
  const router = useRouter();
  const { conversationId } = useLocalSearchParams<{ conversationId: string }>();
  const { user } = useAppUser();
  const { sendMessage, isSendingMessage } = useSendMessage();
  const {
    data: messagesData,
    isLoading: isLoadingMessages,
    isError: isMessagesError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMessages(conversationId || '');

  // Socket management
  useEffect(() => {
    if (!conversationId) return;

    let cleanup: (() => void) | undefined;

    const initSocket = async () => {
      try {
        await socketService.connect();
        socketService.joinConversation(conversationId);

        cleanup = socketService.onReceiveMessage((message: MessageItem) => {
          console.log('📨 New message received:', message);
          refetch();
        });
      } catch (error) {
        console.error('Failed to initialize socket:', error);
      }
    };
    initSocket();

    return () => {
      if (cleanup) cleanup();
      socketService.leaveConversation(conversationId);
    };
  }, [conversationId, refetch]);

  const listRef = useRef<FlatList<MessageItem>>(null)
  const [messageText, setMessageText] = useState('')

  const messages = useMemo<MessageItem[]>(() => {
    if (!messagesData || !user) return [];
    return messagesData.map((message) => ({
      id: message.id,
      content: message.content,
      senderId: message.senderId,
      createdAt: message.createdAt,
      isMine: message.senderId === user.id,
    }))
  }, [messagesData, user])

  const LOAD_MORE_THRESHOLD_PX = 160;
  const loadingMoreRef = useRef(false);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = e.nativeEvent.contentOffset.y
      const shouldLoad = y > LOAD_MORE_THRESHOLD_PX

      if (!shouldLoad) return
      if (!hasNextPage || isFetchingNextPage) return
      if (loadingMoreRef.current) return

      loadingMoreRef.current = true
      fetchNextPage().finally(() => {
        loadingMoreRef.current = false
      })
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  const handleSendMessage = useCallback(async () => {
    if (!messageText.trim() || !conversationId || isSendingMessage || !user) return

    const currentMessage = messageText.trim()
    setMessageText('')

    try {
      await sendMessage({
        conversationId,
        request: { content: currentMessage },
      });

      // Scroll to bottom to show new message
      listRef.current?.scrollToOffset({ offset: 0, animated: true });

    } catch (error) {
      setMessageText(currentMessage);
      console.error('Send message error:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    }
  }, [messageText, conversationId, isSendingMessage, user, sendMessage]);

  if (!conversationId) {
    return (
      <View className="flex-1 items-center justify-center bg-background-light">
        <Text className="text-slate-500">Invalid conversation</Text>
      </View>
    )
  }

  if (isLoadingMessages) {
    return (
      <View className="flex-1 items-center justify-center bg-background-light">
        <ActivityIndicator size="large" color={colors.blue[500]} />
        <Text className="mt-2 text-slate-500">Loading messages...</Text>
      </View>
    )
  }

  if (isMessagesError) {
    return (
      <View className="flex-1 items-center justify-center bg-background-light px-4">
        <WarningCircle size={48} color={colors.red[500]} />
        <Text className="mt-2 text-center text-slate-900 font-semibold">Failed to load messages</Text>
        <Text className="mt-1 text-center text-slate-500">Please check your connection and try again</Text>

        <TouchableOpacity onPress={() => refetch()} className="mt-4 bg-primary px-4 py-2 rounded-lg">
          <Text className="text-white font-semibold">Retry</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background-light"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View className="bg-white border-b border-slate-200 px-4 py-3 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <ArrowLeft size={24} color={colors.slate[500]} />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="font-semibold text-lg text-slate-900">Chat</Text>
          <Text className="text-sm text-slate-500">Conversation {conversationId}</Text>
        </View>
      </View>

      {/* Messages List */}
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MessageItemCard item={item} />}
        className="flex-1 px-4 py-3"
        showsVerticalScrollIndicator={false}
        inverted
        onScroll={handleScroll}
        scrollEventThrottle={16}
        ListFooterComponent={<LoadingFooterComponent isFetchingNextPage={isFetchingNextPage} />}
      />

      {/* Message Input */}
      <View className="bg-white border-t border-slate-200 px-4 py-3">
        <View className="flex-row items-end space-x-2">
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
            onPress={handleSendMessage}
            disabled={!messageText.trim() || isSendingMessage}
            className={`w-10 h-10 rounded-lg items-center justify-center ${messageText.trim() && !isSendingMessage ? 'bg-primary' : 'bg-slate-300'
              }`}
          >
            {isSendingMessage ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <PaperPlaneRight size={18} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}
