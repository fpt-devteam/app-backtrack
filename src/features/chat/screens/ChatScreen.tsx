import { ConversationList } from '@/src/features/chat/components';
import { AppHeader, HeaderTitle } from '@/src/shared/components';
import { SafeAreaView } from 'react-native-safe-area-context';

export const ChatScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <AppHeader left={<HeaderTitle title='Conversation' />} />
      <ConversationList />
    </SafeAreaView>
  )
}