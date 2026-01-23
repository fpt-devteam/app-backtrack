import { ConversationList } from '@/src/features/chat/components';
import { AppHeader } from '@/src/shared/components';
import { SafeAreaView } from 'react-native-safe-area-context';

export const ChatScreen = () => {
  return (
    <SafeAreaView className="flex-1">
      <AppHeader title='Conversations' showBackButton={false} />
      <ConversationList />
    </SafeAreaView>
  )
}