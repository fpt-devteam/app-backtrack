import { CursorScrollResponse } from "@/src/api/common/api.types";
import { ApiResponse } from "@/src/shared/types";
import { PostType } from "../../post/types";
import { Conversation, Message } from "./chat.type";

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
