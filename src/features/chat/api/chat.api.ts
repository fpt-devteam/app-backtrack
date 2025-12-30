import { privateClient } from "@/src/api/common";
import { ConversationsGetResponse, MessagesGetResponse } from "../types";
import { ConversationCreateRequest, ConversationCreateResponse, CursorPaginationParams, MessageSendRequest, MessageSendResponse } from "../types/chat.dto";

const CHAT_API = {
  getConversations: '/chat/conversations',
  createConversation: '/chat/conversations',
  getMessages: (conversationId: string) => `/chat/messages/${conversationId}`,
  sendMessage: (partnerId: string) => `/chat/messages/${partnerId}`,
} as const;

export const getConversationsApi = async (params: CursorPaginationParams) => {
  const response = await privateClient.get<ConversationsGetResponse>(CHAT_API.getConversations, {
    params,
  });
  return response.data;
};

export const getMessagesApi = async (conversationId: string, params: CursorPaginationParams) => {
  const response = await privateClient.get<MessagesGetResponse>(CHAT_API.getMessages(conversationId), {
    params,
  });
  return response.data;
};

export const createConversationApi = async (req: ConversationCreateRequest) => {
  const response = await privateClient.post<ConversationCreateResponse>(CHAT_API.createConversation, req);
  return response.data;
};

export const sendMessageApi = async (conversationId: string, req: MessageSendRequest) => {
  const response = await privateClient.post<MessageSendResponse>(CHAT_API.sendMessage(conversationId), req);
  return response.data;
};
