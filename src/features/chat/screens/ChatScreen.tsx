import {
  ConversationCard,
  ConversationCardSkeleton,
} from "@/src/features/chat/components/ConversationCard";
import { useConversations } from "@/src/features/chat/hooks";
import { AppInlineError } from "@/src/shared/components";
import EmptyList from "@/src/shared/components/ui/EmptyList";
import { colors } from "@/src/shared/theme/colors";
import { MailboxIcon } from "phosphor-react-native";
import React, { useCallback, useMemo, useRef } from "react";
import { FlatList, RefreshControl, View } from "react-native";

export const ChatScreen = () => {
  const {
    data,
    isLoading,
    isError,
    refetch,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useConversations();

  const endReachedLockRef = useRef(false);

  const onLoadMore = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage || endReachedLockRef.current) {
      return;
    }

    endReachedLockRef.current = true;

    fetchNextPage()
      .catch(() => {
        console.log("Error fetching more conversations");
      })
      .finally(() => {
        endReachedLockRef.current = false;
      });
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const refreshing = useMemo(() => {
    return isFetching && !isFetchingNextPage;
  }, [isFetching, isFetchingNextPage]);

  if (isLoading) {
    return (
      <View className="px-4 flex-1 pt-4">
        {Array.from({ length: 6 }, (_, i) => `skeleton-item-${i}`).map((id) => (
          <ConversationCardSkeleton key={id} />
        ))}
      </View>
    );
  }

  if (isError) {
    return (
      <AppInlineError message="Failed to load conversations. Please try again." />
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.conversationId}
      renderItem={({ item }) => <ConversationCard conversation={item} />}
      contentContainerClassName="px-4"
      showsVerticalScrollIndicator={false}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.35}
      ListEmptyComponent={
        <EmptyList
          icon={<MailboxIcon size={96} weight="light" color={colors.primary} />}
          title="You don't have any conversations yet."
          subtitle="Once you receive messages, they will appear here."
          backButton={null}
        />
      }
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => refetch()}
          tintColor={colors.primary}
        />
      }
    />
  );
};
