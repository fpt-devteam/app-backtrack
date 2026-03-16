import type { Nullable } from "@/src/shared/types";



export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  type: string;
  content: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

// --------------------------------
export type ConversationPartner = {
  id: string;
  displayName: string | null;
  email: string | null;
  avatarUrl: string | null;
};

export type Conversation = {
  conversationId: string;
  type: ConversationType;
  partner: Nullable<ConversationPartner>;
  orgId: Nullable<string>;
  lastMessage: Nullable<LastMessage>;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

type LastMessage = {
  senderId: string | null;
  content: string;
  timestamp: string | null;
};

export type MessageItem = {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  isMine: boolean;
};

export const CONVERSATION_TYPE = {
  PERSONAL: 'personal',
  ORGANIZATION: 'organization',
} as const;

export type ConversationType = typeof CONVERSATION_TYPE[keyof typeof CONVERSATION_TYPE];