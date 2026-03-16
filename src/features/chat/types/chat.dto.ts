import type { Conversation, ConversationType, Message } from "@/src/features/chat/types/chat.type";
import type { ApiResponse } from "@/src/shared/api";

export type ConversationCreateRequest = {
  memberId: string,
  type: ConversationType,
};

export type MessageSendRequest = {
  conversationId?: string;
  recipientId?: string;
  orgId?: string;
  type?: string;
  content: string,
};

export type ConversationCreateResponse = ApiResponse<{ conversation: Conversation | null }>;

export type ConversationsGetResponse = ApiResponse<{
  conversations: Conversation[];
  nextCursor: string | null;
  hasMore: boolean;
}>;

export type MessagesGetResponse = ApiResponse<{
  messages: Message[];
  nextCursor: string | null;
  hasMore: boolean;
}>;

export type MessageSendResponse = {
  conversationId: string;
  message: Message;
  isNewConversation?: boolean;
};

export type ConversationDetailResponse = ApiResponse<{ conversation: Conversation | null }>;