import type { ApiResponse } from "@/src/shared/api";
import { Conversation, ConversationType, DirectConversation, Message, UserMessage } from "./chat.type";

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


export type DirectConversationCreateRequest = {
  memberId: string;
};

export type DirectConversationCreateResponse = ApiResponse<{ conversation: DirectConversation }>

export type MessagesPaginationGetResponse = ApiResponse<{
  messages: UserMessage[];
  nextCursor: string | null;
  hasMore: boolean;
}>;