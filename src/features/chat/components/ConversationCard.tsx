import { Conversation } from "@/src/features/chat/types";
import { AppUserAvatar } from "@/src/shared/components";
import { CHAT_ROUTE } from "@/src/shared/constants/route.constant";
import { formatMessageTimestamp } from "@/src/shared/utils";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useCallback, useMemo, useRef } from "react";
import { Animated, Easing, Pressable, Text, View } from "react-native";

type Props = {
  conversation: Conversation;
};

export const ConversationCard = ({ conversation }: Props) => {
  const isLastMessageFromPartner = useMemo(() => {
    return conversation.lastMessage?.senderId === conversation.partner?.id;
  }, [conversation]);

  const isLastMessageUnread = useMemo(() => {
    return conversation.unreadCount > 0 && isLastMessageFromPartner;
  }, [conversation, isLastMessageFromPartner]);

  const displayPartnerName = useMemo(() => {
    const defaultName = "Unknown User";
    if (!conversation.partner) return defaultName;
    return conversation.partner?.displayName || defaultName;
  }, [conversation]);

  const displayLastMessage = useMemo(() => {
    const defaultContent = `Say something to ${
      conversation.partner?.displayName || "your partner"
    }!`;

    const lastContent = conversation.lastMessage?.content;
    if (!lastContent) return defaultContent;

    const prefix = isLastMessageFromPartner ? "" : "You: ";
    return `${prefix}${lastContent}`;
  }, [conversation, isLastMessageFromPartner]);

  const displayTimeText = useMemo(() => {
    if (
      !conversation.lastMessage?.timestamp ||
      !conversation.updatedAt ||
      !conversation.createdAt
    )
      return "";

    return (
      formatMessageTimestamp(conversation.lastMessage?.timestamp) ||
      formatMessageTimestamp(conversation.updatedAt) ||
      formatMessageTimestamp(conversation.createdAt)
    );
  }, [conversation]);

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(CHAT_ROUTE.message(conversation.conversationId));
  }, [conversation.conversationId]);

  const nameTextClass = isLastMessageUnread
    ? "text-base font-semibold text-textPrimary"
    : "text-base font-base text-textPrimary";

  const subtitleTextClass = isLastMessageUnread
    ? "text-sm font-base text-textPrimary"
    : "text-sm font-thin text-textSecondary";

  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (toValue: number) => {
    Animated.timing(scale, {
      toValue,
      duration: 120,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={() => animateTo(0.98)}
      onPressOut={() => animateTo(1)}
      hitSlop={6}
    >
      <Animated.View
        className="w-full primary"
        style={{
          transform: [{ scale }],
        }}
      >
        <View className="flex-row items-center gap-md">
          {/* Avatar */}
          <AppUserAvatar
            avatarUrl={conversation.partner?.avatarUrl}
            size={52}
          />

          {/* Main */}
          <View className="flex-1 gap-xs">
            {/* Row 1: Name + unread dot */}
            <View className="flex-row items-center">
              <Text className={`flex-1 ${nameTextClass}`} numberOfLines={1}>
                {displayPartnerName}
              </Text>

              {/* Time */}
              {displayTimeText && (
                <View className="">
                  <Text
                    className="text-sm font-thin text-textSecondary"
                    style={{ flexShrink: 0 }}
                    numberOfLines={1}
                  >
                    {displayTimeText}
                  </Text>
                </View>
              )}
            </View>

            {/* Last message  */}
            <View className="flex-row">
              <Text className={`${subtitleTextClass} flex-1`} numberOfLines={1}>
                {displayLastMessage}
              </Text>

              {isLastMessageUnread && (
                <View className="w-2 h-2 rounded-full bg-primary" />
              )}
            </View>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
};
