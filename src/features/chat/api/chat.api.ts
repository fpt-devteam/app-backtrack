import { ConversationCreateRequest, ConversationCreateResponse, ConversationDetailResponse, ConversationsGetResponse, CursorPaginationParams, MessageSendRequest, MessageSendResponse, MessagesGetResponse } from "@/src/features/chat/types";
import { privateClient } from "@/src/shared/api";

const CHAT_API = {
  getConversations: '/api/chat/conversations',
  createConversation: '/api/chat/conversations',
  getConversationDetail: (conversationId: string) => `/api/chat/conversations/${conversationId}`,
  getMessages: (conversationId: string) => `/api/chat/messages/${conversationId}`,
  sendMessage: (partnerId: string) => `/api/chat/messages/${partnerId}`,
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

export const getConversationDetailApi = async (conversationId: string) => {
  const response = await privateClient.get<ConversationDetailResponse>(CHAT_API.getConversationDetail(conversationId));
  return response.data;
};
