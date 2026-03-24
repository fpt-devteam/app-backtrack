import { useAppUser } from "@/src/features/auth/providers/user.provider";
import { ConversationHeader } from "@/src/features/chat/components/ConversationHeader";
import { MessageInput } from "@/src/features/chat/components/MessageInput";
import { UserMessageList } from "@/src/features/chat/components/UserMessageList";
import {
  useConversationDetail,
  useSendMessage,
} from "@/src/features/chat/hooks";
import { AppLoader } from "@/src/shared/components";
import { toast } from "@/src/shared/components/ui/toast";
import React, { useCallback } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  conversationId: string;
};

export const ConversationDetailScreen = ({ conversationId }: Props) => {
  const { user } = useAppUser();
  const { sendMessage, isSendingMessage } = useSendMessage();
  const { data: conversationDetail, isLoading: isLoadingConversation } =
    useConversationDetail(conversationId);

  const handleSendMessage = useCallback(
    async (messageText: string) => {
      if (!conversationId || !user) return;
      if (!conversationDetail) return;

      try {
        await sendMessage({
          conversationId,
          request: { conversationId, type: "text", content: messageText },
        });
      } catch (error) {
        toast.error("Failed to send message. Please try again.");
        console.log("Error sending message:", error);
      }
    },
    [conversationId, user, sendMessage, conversationDetail],
  );

  if (!conversationDetail || isLoadingConversation) {
    return (
      <View className="flex-1 bg-white">
        <AppLoader />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1 bg-white"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ConversationHeader partner={conversationDetail.partner} />
        <UserMessageList conversationId={conversationId} />
        <MessageInput onSend={handleSendMessage} isSending={isSendingMessage} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
