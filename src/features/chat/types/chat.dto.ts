import type { Conversation, Message } from "@/src/features/chat/types/chat.type";
import type { PostType } from "@/src/features/post/types";
import type { ApiResponse } from "@/src/shared/api";
import { CursorScrollResponse } from "@/src/shared/api";

export type ConversationCreateRequest = {
  partnerId: string,
  creatorKeyName: PostType,
  partnerKeyName: PostType,
};

export type MessageSendRequest = {
  content: string,
};

export type ConversationCreateResponse = ApiResponse<Pick<Conversation, 'conversationId'>>;

export type ConversationsGetResponse = ApiResponse<CursorScrollResponse<Conversation>>;

export type MessagesGetResponse = ApiResponse<CursorScrollResponse<Message>>;

export type MessageSendResponse = ApiResponse<Message>;

export type ConversationDetailResponse = ApiResponse<Conversation>;