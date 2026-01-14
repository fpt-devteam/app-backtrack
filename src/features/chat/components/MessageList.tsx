import { colors } from '@/src/shared/theme'
import React, { useCallback, useRef } from 'react'
import {
  ActivityIndicator,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  View,
} from 'react-native'
import { MessageItem } from '../types'
import MessageItemCard from './MessageItemCard'

interface MessageListProps {
  messages: MessageItem[]
  hasNextPage?: boolean
  isFetchingNextPage?: boolean
  onLoadMore: () => void
}

const LoadingFooter = ({ isFetchingNextPage }: { isFetchingNextPage: boolean }) => {
  if (!isFetchingNextPage) return null

  return (
    <View className="py-4 items-center">
      <ActivityIndicator size="small" color={colors.blue[500]} />
      <Text className="mt-2 text-slate-500 text-sm">Loading more messages...</Text>
    </View>
  )
}

const MessageList = ({
  messages,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: MessageListProps) => {
  const listRef = useRef<FlatList<MessageItem>>(null)
  const loadingMoreRef = useRef(false)
  const LOAD_MORE_THRESHOLD_PX = 160

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = e.nativeEvent.contentOffset.y
      const shouldLoad = y > LOAD_MORE_THRESHOLD_PX

      if (!shouldLoad) return
      if (!hasNextPage || isFetchingNextPage) return
      if (loadingMoreRef.current) return

      loadingMoreRef.current = true
      onLoadMore()
      setTimeout(() => {
        loadingMoreRef.current = false
      }, 1000)
    },
    [hasNextPage, isFetchingNextPage, onLoadMore]
  )

  return (
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
      ListFooterComponent={<LoadingFooter isFetchingNextPage={!!isFetchingNextPage} />}
    />
  )
}

export default MessageList
