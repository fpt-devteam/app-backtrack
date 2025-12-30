export const CHAT_QUERY_KEY = {
  conversations: ['chat-conversations'],
  conversationCreate: ['chat-conversation-create'],
  messages: (conversationId: string) => ['chat-messages', conversationId],
  messageSend: ['chat-message-send'],
} as const;
