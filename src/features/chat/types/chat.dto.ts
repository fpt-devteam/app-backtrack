import type { Conversation, Message } from "@/src/features/chat/types/chat.type";
import type { PostType } from "@/src/features/post/types";
import { CursorScrollResponse } from "@/src/shared/api";
import type { ApiResponse } from "@/src/shared/types";

export type ConversationCreateRequest = {
  partnerId: string,
  creatorKeyName: PostType,
  partnerKeyName: PostType,
};

export type MessageSendRequest = {
  content: string,
};

export type CursorPaginationParams = {
  cursor?: string,
  limit?: number,
};

export type ConversationCreateResponse = ApiResponse<Pick<Conversation, 'conversationId'>>;

export type ConversationsGetResponse = ApiResponse<CursorScrollResponse<Conversation>>;

export type MessagesGetResponse = ApiResponse<CursorScrollResponse<Message>>;

export type MessageSendResponse = ApiResponse<Message>;

export type ConversationDetailResponse = ApiResponse<Conversation>;