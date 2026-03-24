import { ConversationCreateRequest, ConversationCreateResponse, ConversationDetailResponse, ConversationsGetResponse, DirectConversationCreateRequest, DirectConversationCreateResponse, MessagesPaginationGetResponse } from "@/src/features/chat/types";
import { CursorPaginationParams, privateClient } from "@/src/shared/api";

const CHAT_API = {
  getConversations: '/api/chat/conversations',
  createConversation: '/api/chat/conversations',
  getConversationDetail: (conversationId: string) => `/api/chat/conversations/${conversationId}`,
  getMessages: (conversationId: string) => `/api/chat/conversations/${conversationId}/messages`,
  createDirectConversation: '/api/chat/conversations/direct',
} as const;

export const getConversationsApi = async (params: CursorPaginationParams) => {
  const response = await privateClient.get<ConversationsGetResponse>(CHAT_API.getConversations, {
    params,
  });
  return response.data;
};

export const getMessagesApi = async (conversationId: string, params: CursorPaginationParams) => {
  const response = await privateClient.get<MessagesPaginationGetResponse>(CHAT_API.getMessages(conversationId), {
    params,
  });
  return response.data;
};

export const createConversationApi = async (req: ConversationCreateRequest) => {
  const response = await privateClient.post<ConversationCreateResponse>(CHAT_API.createConversation, req);
  return response.data;
};

export const getConversationDetailApi = async (conversationId: string) => {
  const response = await privateClient.get<ConversationDetailResponse>(CHAT_API.getConversationDetail(conversationId));
  return response.data;
};

export const createDirectConversationApi = async (req: DirectConversationCreateRequest) => {
  const response = await privateClient.post(CHAT_API.createDirectConversation, req);
  return response.data.data as DirectConversationCreateResponse;
};