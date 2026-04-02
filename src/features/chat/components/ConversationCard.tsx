import { Conversation } from "@/src/features/chat/types";
import { AppUserAvatar } from "@/src/shared/components";
import { CHAT_ROUTE } from "@/src/shared/constants/route.constant";
import { formatMessageTimestamp } from "@/src/shared/utils/datetime.utils";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Animated, Easing, Pressable, Text, View } from "react-native";
import ReanimatedAnimated, {
  Easing as ReanimatedEasing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

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
    if (!conversation.lastMessage?.timestamp || !conversation.updatedAt)
      return "";

    return (
      formatMessageTimestamp(conversation.lastMessage?.timestamp) ||
      formatMessageTimestamp(conversation.updatedAt)
    );
  }, [conversation]);

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(CHAT_ROUTE.message(conversation.conversationId));
  }, [conversation.conversationId]);

  const nameTextClass = isLastMessageUnread
    ? "text-base font-bold text-textPrimary"
    : "text-base font-semibold text-textPrimary";

  const subtitleTextClass = isLastMessageUnread
    ? "text-sm font-semibold text-textPrimary"
    : "text-sm text-textSecondary";

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
        className="w-full py-3"
        style={{
          transform: [{ scale }],
        }}
      >
        <View className="flex-row items-center">
          {/* Avatar */}
          <AppUserAvatar
            avatarUrl={conversation.partner?.avatarUrl}
            size={56}
          />

          {/* Main */}
          <View className="flex-1 ml-3">
            {/* Row 1: Name + unread dot */}
            <View className="flex-row items-center">
              <Text className={`flex-1 ${nameTextClass}`} numberOfLines={1}>
                {displayPartnerName}
              </Text>

              {isLastMessageUnread && (
                <View className="w-2 h-2 rounded-full bg-primary ml-2" />
              )}
            </View>

            {/* Last message · time */}
            <View className="flex-row items-center mt-1">
              <Text className={`${subtitleTextClass}`} numberOfLines={1}>
                {displayLastMessage}
              </Text>

              {!!displayTimeText && (
                <View className="flex-row ml-2">
                  <Text className="text-sm text-textSecondary">{" · "}</Text>
                  <Text className="text-sm text-textSecondary" numberOfLines={1}>
                    {displayTimeText}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
};

export const ConversationCardSkeleton = () => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, {
        duration: 1000,
        easing: ReanimatedEasing.inOut(ReanimatedEasing.ease),
      }),
      -1,
      true,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View className="w-full py-3">
      <View className="flex-row items-center">
        {/* Avatar skeleton */}
        <View
          className="rounded-full overflow-hidden"
          style={{
            width: 64,
            height: 64,
            backgroundColor: "#e2e8f0",
          }}
        >
          <ReanimatedAnimated.View
            style={[
              {
                width: 64,
                height: 64,
                backgroundColor: "#f1f5f9",
              },
              animatedStyle,
            ]}
          />
        </View>

        {/* Main content skeleton */}
        <View className="flex-1 ml-3">
          {/* Name skeleton */}
          <View
            style={{
              width: "60%",
              height: 18,
              borderRadius: 4,
              backgroundColor: "#e2e8f0",
              overflow: "hidden",
            }}
          >
            <ReanimatedAnimated.View
              style={[
                {
                  width: "100%",
                  height: 18,
                  backgroundColor: "#f1f5f9",
                },
                animatedStyle,
              ]}
            />
          </View>

          {/* Last message skeleton */}
          <View className="mt-2">
            <View
              style={{
                width: "85%",
                height: 14,
                borderRadius: 4,
                backgroundColor: "#e2e8f0",
                overflow: "hidden",
              }}
            >
              <ReanimatedAnimated.View
                style={[
                  {
                    width: "100%",
                    height: 14,
                    backgroundColor: "#f1f5f9",
                  },
                  animatedStyle,
                ]}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
