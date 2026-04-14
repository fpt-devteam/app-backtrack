import { useAppUser } from "@/src/features/auth/providers/user.provider";
import { MessageInput } from "@/src/features/chat/components/MessageInput";
import { UserMessageList } from "@/src/features/chat/components/UserMessageList";
import {
  useConversationDetail,
  useSendMessage,
} from "@/src/features/chat/hooks";
import {
  AppBackButton,
  AppLoader,
  AppUserAvatar,
} from "@/src/shared/components";
import { toast } from "@/src/shared/components/ui/toast";
import React, { useCallback, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CHAT_ROUTE } from "@/src/shared/constants";
import { router, Stack } from "expo-router";
import { useMemo } from "react";
import { Text } from "react-native";

type Props = {
  conversationId: string;
};

export const ConversationDetailScreen = ({ conversationId }: Props) => {
  const { user } = useAppUser();
  const { sendMessage, isSendingMessage } = useSendMessage();
  const { data: conversationDetail, isLoading: isLoadingConversation } =
    useConversationDetail(conversationId);

  const isLoading = isLoadingConversation || !conversationDetail;
  const partner = conversationDetail?.partner;

  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const displayPartnerName = useMemo(() => {
    return partner?.displayName || "Unknown User";
  }, [partner]);

  const displayPartnerAvatar = useMemo(() => {
    if (!partner) return null;
    return "avatarUrl" in partner ? partner.avatarUrl : null;
  }, [partner]);

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
      }
    },
    [conversationId, user, sendMessage, conversationDetail],
  );

  const handleSendImage = useCallback(
    async (imageUrl: string) => {
      if (!conversationId || !user) return;

      try {
        await sendMessage({
          conversationId,
          request: { conversationId, type: "image", content: imageUrl },
        });
      } catch {
        toast.error("Failed to send image. Please try again.");
      }
    },
    [conversationId, user, sendMessage],
  );

  const handlePressDetails = useCallback(() => {
    router.push(CHAT_ROUTE.information(conversationId));
  }, [conversationId]);

  return (
    <KeyboardAvoidingView
      className="flex-1 px-sm bg-surface"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? -insets.bottom : 0}
    >
      <Stack.Screen
        options={{
          header: () => (
            <View
              className="bg-surface border-b border-divider px-md py-sm flex-row justify-between items-center w-full"
              style={{ paddingTop: insets.top }}
            >
              <View className="w-24 items-start">
                <AppBackButton type="arrowLeftIcon" showBackground={false} />
              </View>

              <View className="flex-1 flex-col justify-center items-center gap-xs">
                <AppUserAvatar avatarUrl={displayPartnerAvatar} size={32} />
                <Text
                  className="text-sm font-normal text-textPrimary"
                  numberOfLines={1}
                  style={{ maxWidth: width * 0.5 }}
                >
                  {displayPartnerName}
                </Text>
              </View>

              <View className="w-24 items-end ">
                <Pressable
                  className="py-sm px-md rounded-full bg-muted"
                  onPress={handlePressDetails}
                >
                  <Text className="text-sm font-normal text-textPrimary">
                    Details
                  </Text>
                </Pressable>
              </View>
            </View>
          ),
        }}
      />

      <View
        className="flex-1 bg-surface"
        style={{ paddingBottom: insets.bottom }}
      >
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <AppLoader />
          </View>
        ) : (
          <UserMessageList
            conversationId={conversationId}
            partner={conversationDetail?.partner}
          />
        )}



        {/* Message input */}
        <MessageInput
          onSend={handleSendMessage}
          onSendImage={handleSendImage}
          isSending={isSendingMessage}
        />
      </View>
    </KeyboardAvoidingView>
  );
};
