import { ConversationList } from '@/src/features/chat/components';
import { AppHeader } from '@/src/shared/components';
import { View } from 'react-native';

export default function ChatScreen() {
  return (
    <View className="flex-1">
      <AppHeader title='Conversations' showBackButton={false} />
      <ConversationList />
    </View>
  )
}