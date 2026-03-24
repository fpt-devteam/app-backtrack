import { useMessages } from "@/src/features/chat/hooks";
import { socketChatService } from "@/src/features/chat/services";
import { UserMessage } from "@/src/features/chat/types";
import { AppLoader } from "@/src/shared/components";
import React, { useCallback, useEffect, useRef } from "react";
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { UserMessageBubble } from "./UserMessageBubble";

type Props = {
  conversationId: string;
};

export const UserMessageList = ({ conversationId }: Props) => {
  const {
    data: messages,
    refetch: refetchMessages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMessages(conversationId);

  const listRef = useRef<FlatList<UserMessage>>(null);
  const loadingMoreRef = useRef(false);
  const LOAD_MORE_THRESHOLD_PX = 160;

  const handleLoadMore = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    fetchNextPage().catch(() => {
      console.log("Error fetching more messages");
    });
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = e.nativeEvent.contentOffset.y;
      const shouldLoad = y > LOAD_MORE_THRESHOLD_PX;

      if (!shouldLoad) return;
      if (!hasNextPage || isFetchingNextPage) return;
      if (loadingMoreRef.current) return;

      loadingMoreRef.current = true;
      handleLoadMore();
      setTimeout(() => {
        loadingMoreRef.current = false;
      }, 1000);
    },
    [hasNextPage, isFetchingNextPage, handleLoadMore],
  );

  useEffect(() => {
    if (!conversationId) return;

    let cleanup: (() => void) | undefined;

    const initSocket = async () => {
      try {
        await socketChatService.connect();
        socketChatService.joinConversation(conversationId);

        cleanup = socketChatService.onReceiveMessage((message) => {
          console.log("📨 New message received:", message);
          refetchMessages();
        });
      } catch (error) {
        console.error("Failed to initialize socket:", error);
      }
    };
    initSocket();

    return () => {
      if (cleanup) cleanup();
      socketChatService.leaveConversation(conversationId);
    };
  }, [conversationId, refetchMessages]);

  return (
    <FlatList
      ref={listRef}
      data={messages}
      keyExtractor={(item) => item.createdAt}
      renderItem={({ item }) => <UserMessageBubble message={item} />}
      contentContainerClassName="gap-4"
      className="flex-1 p-4"
      showsVerticalScrollIndicator={false}
      inverted
      onScroll={handleScroll}
      scrollEventThrottle={16}
      ListFooterComponent={<>{isFetchingNextPage && <AppLoader />}</>}
    />
  );
};
