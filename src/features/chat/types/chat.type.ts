import type { AppUser } from "@/src/features/auth/types";
import type { Nullable } from "@/src/shared/types";

export type Conversation = {
  conversationId: string;
  partner: AppUser;
  lastMessage: Nullable<LastMessage>;
  unreadCount?: number;
  updatedAt?: string;
};

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
type LastMessage = {
  lastContent: string;
  timestamp: string;
};

export type MessageItem = {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  isMine: boolean;
};
