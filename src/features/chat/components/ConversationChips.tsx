import { Conversation } from "@/src/features/chat/types";
import { CHAT_ROUTE } from "@/src/shared/constants/route.constant";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useCallback, useMemo, useRef } from "react";
import { Animated, Easing, Pressable, Text } from "react-native";

type Props = {
  conversation: Conversation;
};

export const ConversationChips = ({ conversation }: Props) => {
  const displayPartnerName = useMemo(() => {
    const defaultName = "Unknown";
    if (!conversation.partner) return defaultName;

    const fullName = conversation.partner?.displayName || defaultName;
    const lastWord = fullName.split(" ").findLast(Boolean) || fullName;
    return lastWord;
  }, [conversation.partner]);

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(CHAT_ROUTE.message(conversation.conversationId));
  }, [conversation.conversationId]);

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
      onPressIn={() => animateTo(0.95)}
      onPressOut={() => animateTo(1)}
      hitSlop={8}
    >
      <Animated.View
        className="items-center mr-4"
        style={{
          transform: [{ scale }],
        }}
      >
        {/* Avatar */}
        {/* <ConversationAvatar user={conversation.partner} size={80} /> */}

        {/* Name */}
        <Text
          className="text-xs font-sm text-slate-600 mt-2 text-center"
          numberOfLines={1}
        >
          {displayPartnerName}
        </Text>
      </Animated.View>
    </Pressable>
  );
};
