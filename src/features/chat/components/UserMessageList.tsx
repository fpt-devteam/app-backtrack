import { useAppUser } from "@/src/features/auth/providers/user.provider";
import { useMessages } from "@/src/features/chat/hooks";
import { socketChatService } from "@/src/features/chat/services";
import type {
  ConversationPartner,
  UserMessage,
} from "@/src/features/chat/types";
import { AppLoader, AppUserAvatar } from "@/src/shared/components";
import type { Nullable } from "@/src/shared/types";
import { getDateLabel, isSameDay } from "@/src/shared/utils";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  Text,
  View,
} from "react-native";
import { UserMessageBubble } from "./UserMessageBubble";

type Props = {
  conversationId: string;
  partner: Nullable<ConversationPartner>;
  onSendSuggestion?: (text: string) => Promise<void>;
};

const GROUP_THRESHOLD_MS = 2 * 60 * 1000;

const SUGGESTIONS = [
  "👋 Hi there!",
  "Did you find something?",
  "I think I found your item!",
];

function computeGroupInfo(
  messages: UserMessage[],
  index: number,
): { isTopOfGroup: boolean; isBottomOfGroup: boolean } {
  const current = messages[index];
  const above = messages[index + 1];
  const below = messages[index - 1];

  const isTopOfGroup =
    !above ||
    above.senderId !== current.senderId ||
    Math.abs(
      new Date(current.createdAt).getTime() -
        new Date(above.createdAt).getTime(),
    ) > GROUP_THRESHOLD_MS;

  const isBottomOfGroup =
    !below ||
    below.senderId !== current.senderId ||
    Math.abs(
      new Date(current.createdAt).getTime() -
        new Date(below.createdAt).getTime(),
    ) > GROUP_THRESHOLD_MS;

  return { isTopOfGroup, isBottomOfGroup };
}

const DateSeparator = ({ label }: { label: string }) => (
  <View className="items-center p-md">
    <Text className="text-xs text-textPrimary font-normal">{label}</Text>
  </View>
);

const TypingBubble = ({ avatarUrl }: { avatarUrl?: string | null }) => (
  <View className="w-full items-start mb-md">
    <View className="flex-row items-end justify-start max-w-[75%] gap-xs">
      <AppUserAvatar avatarUrl={avatarUrl} size={28} />

      <View className="px-md py-md2 items-center justify-center rounded-md bg-muted/90">
        <AppLoader
          dotSize={6}
          colorClass="bg-mutedForeground"
          bounceHeight={5}
        />
      </View>
    </View>
  </View>
);

type EmptyConversationStateProps = {
  partner: Nullable<ConversationPartner>;
  onSendSuggestion?: (text: string) => Promise<void>;
};

const EmptyConversationState = ({
  partner,
  onSendSuggestion,
}: EmptyConversationStateProps) => (
  <View className="flex-1 items-center justify-center gap-lg px-xl">
    <AppUserAvatar avatarUrl={partner?.avatarUrl} size={72} />

    <View className="items-center gap-xs">
      <Text className="text-lg font-semibold text-textPrimary">
        {partner?.displayName ?? "Unknown User"}
      </Text>
      <Text className="text-sm text-textSecondary text-center">
        Start the conversation
      </Text>
    </View>

    <View className="flex-row flex-wrap justify-center gap-sm">
      {SUGGESTIONS.map((suggestion) => (
        <Pressable
          key={suggestion}
          onPress={() => onSendSuggestion?.(suggestion)}
          className="px-md py-sm rounded-full border border-divider bg-surface active:bg-muted"
        >
          <Text className="text-sm text-textPrimary">{suggestion}</Text>
        </Pressable>
      ))}
    </View>
  </View>
);

export const UserMessageList = ({
  conversationId,
  partner,
  onSendSuggestion,
}: Props) => {
  const { user } = useAppUser();
  const [isTyping, setIsTyping] = useState(false);

  const {
    data: messages,
    isLoading,
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
    let cleanupTyping: (() => void) | undefined;
    let typingTimeoutId: ReturnType<typeof setTimeout> | null = null;

    const initSocket = async () => {
      try {
        await socketChatService.connect();

        socketChatService.joinConversation(conversationId);
        socketChatService.readMessages(conversationId);

        cleanup = socketChatService.onReceiveMessage((message) => {
          console.log("📨 New message received:", message);
          refetchMessages();
        });

        cleanupTyping = socketChatService.onTypingUser(
          ({ userId, isTyping }) => {
            if (userId !== partner?.id) return;

            if (isTyping) {
              setIsTyping(true);
              if (typingTimeoutId) clearTimeout(typingTimeoutId);
              typingTimeoutId = setTimeout(() => setIsTyping(false), 4000);
            } else {
              setIsTyping(false);
              if (typingTimeoutId) {
                clearTimeout(typingTimeoutId);
                typingTimeoutId = null;
              }
            }
          },
        );
      } catch (error) {
        console.error("Failed to initialize socket:", error);
      }
    };
    initSocket();

    return () => {
      if (cleanup) cleanup();
      if (cleanupTyping) cleanupTyping();
      if (typingTimeoutId) clearTimeout(typingTimeoutId);
      socketChatService.leaveConversation(conversationId);
    };
  }, [conversationId, partner?.id, refetchMessages]);

  if (messages.length === 0 && !isLoading) {
    return (
      <EmptyConversationState
        partner={partner}
        onSendSuggestion={onSendSuggestion}
      />
    );
  }

  return (
    <FlatList
      ref={listRef}
      data={messages}
      keyExtractor={(item) => item.createdAt}
      renderItem={({ item, index }) => {
        const { isTopOfGroup, isBottomOfGroup } = computeGroupInfo(
          messages ?? [],
          index,
        );

        const isOwn = item.senderId === user?.id;
        const above = (messages ?? [])[index + 1];
        const currentDate = new Date(item.createdAt);
        const showDateSeparator =
          !above || !isSameDay(currentDate, new Date(above.createdAt));

        const spacing = isBottomOfGroup ? "mb-md" : "mb-xs";

        return (
          <View className={spacing}>
            <UserMessageBubble
              message={item}
              isOwnMessage={isOwn}
              isTopOfGroup={isTopOfGroup}
              isBottomOfGroup={isBottomOfGroup}
              partnerAvatarUrl={partner?.avatarUrl}
            />
            {showDateSeparator && (
              <DateSeparator label={getDateLabel(currentDate)} />
            )}
          </View>
        );
      }}
      className="flex-1"
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <>{isTyping && <TypingBubble avatarUrl={partner?.avatarUrl} />}</>
      }
      inverted
      onScroll={handleScroll}
      scrollEventThrottle={16}
      ListFooterComponent={<>{isFetchingNextPage && <AppLoader />}</>}
    />
  );
};
