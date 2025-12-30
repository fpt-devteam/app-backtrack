import { ConversationCard } from '@/src/features/chat/components'
import { useConversations } from '@/src/features/chat/hooks'
import React, { useCallback, useMemo, useRef } from 'react'
import { ActivityIndicator, FlatList, RefreshControl, Text, View } from 'react-native'

const Footer = ({
  isFetchingNextPage,
  hasNextPage,
}: {
  isFetchingNextPage: boolean
  hasNextPage: boolean
}) => {
  if (isFetchingNextPage) {
    return (
      <View className="py-4 items-center">
        <ActivityIndicator size="small" color="#0ea5e9" />
        <Text className="mt-2 text-slate-500 text-sm">Loading more...</Text>
      </View>
    )
  }

  if (!hasNextPage) {
    return (
      <View className="py-4 items-center">
        <Text className="text-slate-400 text-sm">No more conversations</Text>
      </View>
    )
  }

  return <View className="h-3" />
}

const Empty = () => (
  <View className="flex-1 items-center justify-center py-20">
    <Text className="text-slate-500">No conversations yet</Text>
  </View>
)

const ConversationScreen = () => {
  const {
    data,
    isLoading,
    isError,
    refetch,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useConversations()

  const endReachedLockRef = useRef(false);

  const onLoadMore = useCallback(() => {
    if (!hasNextPage) return;
    if (isFetchingNextPage) return;
    if (endReachedLockRef.current) return;

    endReachedLockRef.current = true;

    fetchNextPage()
      .catch(() => {
        console.log("Error fetching more conversations");
      })
      .finally(() => {
        endReachedLockRef.current = false;
      })
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const refreshing = useMemo(() => {
    return isFetching && !isFetchingNextPage
  }, [isFetching, isFetchingNextPage])

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#0ea5e9" />
        <Text className="mt-2 text-slate-500">Loading...</Text>
      </View>
    )
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center px-5">
        <Text className="text-red-500 text-center">Error loading conversations</Text>
        <Text className="text-slate-500 text-center mt-2">Pull to retry</Text>
      </View>
    )
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.conversationId}
      renderItem={({ item }) => <ConversationCard conversation={item} />}
      contentContainerStyle={{ paddingVertical: 12 }}
      showsVerticalScrollIndicator={false}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.35}
      ListFooterComponent={
        <Footer isFetchingNextPage={isFetchingNextPage} hasNextPage={!!hasNextPage} />
      }
      ListEmptyComponent={<Empty />}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => refetch()}
          tintColor="#0ea5e9"
        />
      }
    />
  )
}

export default ConversationScreen
