import { ConversationAvatar } from "@/src/features/chat/components/ConversationAvatar";
import { Conversation } from "@/src/features/chat/types";
import { CHAT_ROUTE } from "@/src/shared/constants/route.constant";
import * as Haptics from "expo-haptics";
import { ExternalPathString, RelativePathString, router } from "expo-router";
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

const formatLastMessageTime = (iso?: string) => {
  if (!iso) return "";

  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";

  const now = new Date();

  const isSameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();

  if (isSameDay) {
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    if (hours === 0) hours = 12;

    return `${hours}:${minutes} ${ampm}`;
  }

  const MM = String(d.getMonth() + 1).padStart(2, "0");
  const DD = String(d.getDate()).padStart(2, "0");
  return `${MM}:${DD}`;
};

export const ConversationCard = ({ conversation }: Props) => {
  const isLastMessageMine = useMemo(() => true, []); // mock
  const isLastMessageUnread = useMemo(() => false, []); // mock

  const displayPartnerName = useMemo(() => {
    const defaultName = "Unknown User";
    if (!conversation.partner) return defaultName;
    return conversation.partner?.displayName || defaultName;
  }, [conversation.partner]);

  const displayLastText = useMemo(() => {
    const prefix = isLastMessageMine ? "You: " : "";

    const lastContent = conversation.lastMessage?.lastContent;
    if (!lastContent) {
      return `Say something to ${
        conversation.partner?.displayName || "your partner"
      }!`;
    }

    return `${prefix}${lastContent}`;
  }, [
    conversation.lastMessage?.lastContent,
    conversation.partner,
    isLastMessageMine,
  ]);

  const displayTimeText = useMemo(() => {
    return (
      formatLastMessageTime(conversation.lastMessage?.timestamp) ||
      formatLastMessageTime(conversation.updatedAt)
    );
  }, [conversation.lastMessage?.timestamp, conversation.updatedAt]);

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(
      CHAT_ROUTE.message(conversation.conversationId) as
        | ExternalPathString
        | RelativePathString,
    );
  }, [conversation.conversationId]);

  const nameTextClass = isLastMessageUnread
    ? "text-base font-bold text-slate-900"
    : "text-base font-semibold text-slate-900";

  const subtitleTextClass = isLastMessageUnread
    ? "text-sm font-semibold text-slate-900"
    : "text-sm text-slate-600";

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
        className="w-full mb-4"
        style={{
          transform: [{ scale }],
        }}
      >
        <View className="flex-row items-center">
          {/* Avatar */}
          <ConversationAvatar user={conversation.partner} />

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
                {displayLastText}
              </Text>

              {!!displayTimeText && (
                <View className="flex-row ml-2">
                  <Text className="text-sm text-slate-500">{" · "}</Text>
                  <Text className="text-sm text-slate-500" numberOfLines={1}>
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
    <View className="w-full mb-4">
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
