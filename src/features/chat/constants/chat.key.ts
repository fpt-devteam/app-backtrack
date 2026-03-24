export const CHAT_QUERY_KEY = {
  conversations: ['chat-conversations'],
  conversationCreate: ['chat-conversation-create'],
  conversationDetail: (conversationId: string) => ['chat-conversation-detail', conversationId],
  messages: (conversationId: string) => ['chat-messages', conversationId],
  messageSend: ['chat-message-send'],
  createDirectConversation: ['create-direct-conversations'],
} as const;
