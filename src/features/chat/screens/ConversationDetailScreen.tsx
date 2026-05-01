import { useAppUser } from "@/src/features/auth/providers/user.provider";
import { MessageInput } from "@/src/features/chat/components/MessageInput";
import { UserMessageList } from "@/src/features/chat/components/UserMessageList";
import {
  useConversationDetail,
  useSendMessage,
} from "@/src/features/chat/hooks";
import { HandoverCard } from "@/src/features/handover/components";
import { useGetC2CReturnReportsByPartner } from "@/src/features/handover/hooks";
import { useSendNotification } from "@/src/features/notification/hooks";
import { NotificationSendRequest } from "@/src/features/notification/types";
import {
  AppBackButton,
  AppLoader,
  AppUserAvatar,
} from "@/src/shared/components";
import { toast } from "@/src/shared/components/ui/toast";
import { colors } from "@/src/shared/theme";
import { CaretDownIcon, CaretUpIcon, PushPinIcon } from "phosphor-react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CHAT_ROUTE } from "@/src/shared/constants";
import { router, Stack } from "expo-router";

type Props = {
  conversationId: string;
};

export const ConversationDetailScreen = ({ conversationId }: Props) => {
  const { user } = useAppUser();
  const [isPinnedExpanded, setIsPinnedExpanded] = useState(false);
  const { sendMessage, isSendingMessage } = useSendMessage();
  const { data: conversationDetail, isLoading: isLoadingConversation } =
    useConversationDetail(conversationId);

  const { sendNotification } = useSendNotification();

  const partner = conversationDetail?.partner;

  const { inProgressHandovers, isLoading: isHandoverLoading } =
    useGetC2CReturnReportsByPartner(partner?.id);

  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const isLoading =
    isLoadingConversation || !conversationDetail || isHandoverLoading;

  const pinnedHandover = inProgressHandovers[0];
  const hasPinnedHandovers = inProgressHandovers.length > 0;

  const displayPartnerName = useMemo(() => {
    return partner?.displayName || "Unknown User";
  }, [partner]);

  const displayPartnerAvatar = useMemo(() => {
    if (!partner) return null;
    return "avatarUrl" in partner ? partner.avatarUrl : null;
  }, [partner]);

  useEffect(() => {
    if (!hasPinnedHandovers && isPinnedExpanded) {
      setIsPinnedExpanded(false);
    }
  }, [hasPinnedHandovers, isPinnedExpanded]);

  const handleSendMessage = useCallback(
    async (messageText: string) => {
      if (!conversationId || !user) return;
      if (!conversationDetail || !conversationDetail.partner) return;

      try {
        await sendMessage({
          conversationId,
          request: { conversationId, type: "text", content: messageText },
        });

        const req: NotificationSendRequest = {
          target: {
            userId: conversationDetail.partner.id,
          },
          source: {
            name: "Message from " + (user.displayName || "Unknown User"),
            eventId: new Date().toString(),
          },
          title: "Message from " + (user.displayName || "Unknown User"),
          body: messageText,
          type: "ChatEvent",
          data: { screenPath: CHAT_ROUTE.message(conversationId) },
        };

        await sendNotification(req);
      } catch (_error) {
        toast.error("Failed to send message. Please try again.");
      }
    },
    [conversationId, user, sendMessage, conversationDetail, sendNotification],
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

  const handleExpandPinned = useCallback(() => {
    if (!hasPinnedHandovers) return;
    setIsPinnedExpanded(true);
  }, [hasPinnedHandovers]);

  const handleCollapsePinned = useCallback(() => {
    setIsPinnedExpanded(false);
  }, []);

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

      {/* Message list */}
      <View
        className="flex-1 bg-surface relative"
        style={{ paddingBottom: insets.bottom }}
      >
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <AppLoader />
          </View>
        ) : (
          <>
            {hasPinnedHandovers && pinnedHandover ? (
              <View className="pb-md pt-sm">
                <View
                  className="rounded-sm border border-divider bg-surface px-sm py-sm"
                  style={{
                    shadowColor: colors.black,
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.12,
                    shadowRadius: 16,
                  }}
                >
                  <View className="mb-sm flex-row items-center justify-between">
                    <View className="flex-row items-center gap-xs">
                      <PushPinIcon
                        size={14}
                        color={colors.primary}
                        weight="fill"
                      />
                      <Text className="text-sm font-normal text-textPrimary">
                        Pinned handovers
                      </Text>
                    </View>

                    {isPinnedExpanded ? (
                      <Pressable onPress={handleCollapsePinned}>
                        <View className="flex-row items-center gap-xs">
                          <Text className="text-xs font-thin text-textSecondary">
                            Collapse
                          </Text>
                          <CaretUpIcon
                            size={16}
                            color={colors.text.secondary}
                            weight="bold"
                          />
                        </View>
                      </Pressable>
                    ) : (
                      <Pressable onPress={handleExpandPinned}>
                        <View className="flex-row items-center gap-xs">
                          <Text className="text-xs font-thin text-textSecondary">
                            {inProgressHandovers.length}
                          </Text>
                          <CaretDownIcon
                            size={16}
                            color={colors.text.secondary}
                            weight="bold"
                          />
                        </View>
                      </Pressable>
                    )}
                  </View>

                  {isPinnedExpanded ? (
                    <View className="gap-md">
                      {inProgressHandovers.map((handover) => (
                        <HandoverCard key={handover.id} handover={handover} />
                      ))}
                    </View>
                  ) : (
                    <Pressable onPress={handleExpandPinned}>
                      <View pointerEvents="none">
                        <HandoverCard handover={pinnedHandover} />
                      </View>
                    </Pressable>
                  )}
                </View>
              </View>
            ) : null}

            <UserMessageList
              conversationId={conversationId}
              partner={conversationDetail?.partner}
              onSendSuggestion={handleSendMessage}
            />
          </>
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
