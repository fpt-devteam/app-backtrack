import {
  ConversationCard,
  ConversationCardSkeleton,
} from "@/src/features/chat/components/ConversationCard";
import { ConversationChips } from "@/src/features/chat/components/ConversationChips";
import { useConversations } from "@/src/features/chat/hooks";
import { AppInlineError } from "@/src/shared/components";
import { colors } from "@/src/shared/theme/colors";
import { EmptyIcon } from "phosphor-react-native";
import React, { useCallback, useMemo, useRef } from "react";
import { FlatList, RefreshControl, View } from "react-native";

type Props = {
  mode: "vertical" | "horizontal";
  ListHeaderComponent?: React.ReactElement;
};

export const ConversationList = ({
  mode = "vertical",
  ListHeaderComponent,
}: Props) => {
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

  if (mode === "horizontal") {
    return (
      <FlatList
        data={data}
        keyExtractor={(item) => item.conversationId}
        renderItem={({ item }) => <ConversationChips conversation={item} />}
        contentContainerStyle={{ alignItems: "center" }}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="px-4"
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.35}
        ListEmptyComponent={<EmptyIcon color={colors.slate[400]} />}
        ListHeaderComponent={ListHeaderComponent}
      />
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
      ListEmptyComponent={<EmptyIcon color={colors.slate[400]} />}
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
