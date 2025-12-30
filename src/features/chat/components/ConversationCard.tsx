import { CHAT_ROUTE } from '@/src/shared/constants/route.constant';
import { ExternalPathString, RelativePathString, router } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { Conversation } from '../types';

type Props = {
  conversation: Conversation;
};

const ConversationCard = ({ conversation }: Props) => {
  return (
    <TouchableOpacity
      activeOpacity={0.2}
      onPress={() => {
        console.log("Open conversation:", conversation.conversationId);
        router.push(CHAT_ROUTE.message(conversation.conversationId) as ExternalPathString | RelativePathString);
      }}
      className="w-full border border-red-300 px-4 py-3"
    >
      <Text>{conversation.conversationId}</Text>
    </TouchableOpacity>
  );
}

export default ConversationCard;
