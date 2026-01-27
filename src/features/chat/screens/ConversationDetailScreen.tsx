import { useAppUser } from "@/src/features/auth/providers/user.provider";
import { ConversationHeader } from "@/src/features/chat/components/ConversationHeader";
import { MessageInput } from "@/src/features/chat/components/MessageInput";
import { MessageList } from "@/src/features/chat/components/MessageList";
import {
  useConversationDetail,
  useMessages,
  useSendMessage,
} from "@/src/features/chat/hooks";
import { MessageItem } from "@/src/features/chat/types";
import { useSendNotification } from "@/src/features/notification/hooks";
import { NOTIFICATION_EVENT } from "@/src/features/notification/types";
import { AppLoader } from "@/src/shared/components";
import { toast } from "@/src/shared/components/ui/toast";
import { socketService } from "@/src/shared/services";
import React, { useCallback, useEffect, useMemo } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ConversationDetailScreenProps {
  conversationId: string;
}

export const ConversationDetailScreen = ({
  conversationId,
}: ConversationDetailScreenProps) => {
  const insets = useSafeAreaInsets();

  const { user } = useAppUser();
  const { sendMessage, isSendingMessage } = useSendMessage();
  const { data: conversationDetail, isLoading: isLoadingConversation } =
    useConversationDetail(conversationId);
  const { sendNotification } = useSendNotification();

  const {
    data: messagesData,
    isLoading: isLoadingMessages,
    isError: isMessagesError,
    refetch: refetchMessages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMessages(conversationId);

  // Socket management
  useEffect(() => {
    if (!conversationId) return;

    let cleanup: (() => void) | undefined;

    const initSocket = async () => {
      try {
        await socketService.connect();
        socketService.joinConversation(conversationId);

        cleanup = socketService.onReceiveMessage((message: MessageItem) => {
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
      socketService.leaveConversation(conversationId);
    };
  }, [conversationId, refetchMessages]);

  const messages = useMemo<MessageItem[]>(() => {
    if (!messagesData || !user) return [];
    return messagesData.map((message) => ({
      id: message.id,
      content: message.content,
      senderId: message.senderId,
      createdAt: message.createdAt,
      isMine: message.senderId === user.id,
    }));
  }, [messagesData, user]);

  const handleLoadMore = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    fetchNextPage().catch(() => {
      console.log("Error fetching more messages");
    });
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleSendMessage = useCallback(
    async (messageText: string) => {
      if (!conversationId || !user) return;
      if (!conversationDetail) return;

      try {
        await sendMessage({
          conversationId,
          request: { content: messageText },
        });

        const partnerId = conversationDetail.partner.id;

        const req = {
          target: {
            userId: partnerId,
          },
          source: {
            name: "ChatSystem",
            eventId: Date.now().toString(),
          },
          type: NOTIFICATION_EVENT.ChatEvent,
          title: "New Message",
          body: `New message for you: ${messageText}.`,
          data: {
            screenPath: "chat/conversations/" + conversationId,
            imageUrl: user.avatar,
          },
        };
        await sendNotification(req);
      } catch (error) {
        toast.error("Failed to send message. Please try again.");
        console.log("Error sending message:", error);
      }
    },
    [conversationId, user, sendMessage, sendNotification, conversationDetail],
  );

  if (!conversationDetail || isLoadingConversation) {
    return (
      <View className="flex-1 bg-background-light">
        <AppLoader />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background-light"
      style={{ paddingTop: insets.top }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ConversationHeader user={conversationDetail.partner} />
      <MessageList
        messages={messages}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={handleLoadMore}
        partnerAvatar={conversationDetail.partner.avatar}
      />
      <View style={{ paddingBottom: insets.bottom }}>
        <MessageInput onSend={handleSendMessage} isSending={isSendingMessage} />
      </View>
    </KeyboardAvoidingView>
  );
};
