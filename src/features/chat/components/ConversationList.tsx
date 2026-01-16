import { ConversationCard } from '@/src/features/chat/components/ConversationCard'
import { useConversations } from '@/src/features/chat/hooks'
import { AppInlineError, AppLoader } from '@/src/shared/components'
import colors from '@/src/shared/theme/colors'
import { EmptyIcon } from 'phosphor-react-native'
import React, { useCallback, useMemo, useRef } from 'react'
import { FlatList, RefreshControl } from 'react-native'

interface FooterProps {
  isFetchingNextPage: boolean
  hasNextPage: boolean
}

const Footer = ({ isFetchingNextPage, hasNextPage }: FooterProps) => {
  if (isFetchingNextPage) {
    return <AppLoader />;
  }
  return null;
}

export const ConversationList = () => {
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

  const endReachedLockRef = useRef(false)

  const onLoadMore = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage || endReachedLockRef.current) {
      return
    }

    endReachedLockRef.current = true

    fetchNextPage()
      .catch(() => {
        console.log('Error fetching more conversations')
      })
      .finally(() => {
        endReachedLockRef.current = false
      })
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const refreshing = useMemo(() => {
    return isFetching && !isFetchingNextPage
  }, [isFetching, isFetchingNextPage])

  if (isLoading) {
    return <AppLoader />
  }

  if (isError) {
    return <AppInlineError message="Failed to load conversations. Please try again." />
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
      ListEmptyComponent={<EmptyIcon color={colors.slate[400]} />}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => refetch()}
          tintColor={colors.primary}
        />
      }
      className='px-2 flex-1'
    />
  )
}


