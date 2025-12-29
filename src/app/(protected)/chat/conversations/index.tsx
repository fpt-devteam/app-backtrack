import { ConservationCard } from '@/src/features/chat/components';
import { useGetConversations } from '@/src/features/chat/hooks';
import React from 'react';
import { FlatList, Text, View } from 'react-native';

const ConversationScreen = () => {
  const { data, isLoading, isError } = useGetConversations();

  if (isLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    )
  }

  if (isError) {
    return (
      <View>
        <Text>Error loading conversations</Text>
      </View>
    )
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.conversationId}
      renderItem={({ item }) => <ConservationCard conversation={item} />}
    />
  )
}

export default ConversationScreen
