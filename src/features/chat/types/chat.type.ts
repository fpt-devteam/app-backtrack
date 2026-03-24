
/*--------------------------------*/
import type { Nullable } from "@/src/shared/types";

export type MessageItem = {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  isMine: boolean;
};

export const MESSAGE_TYPE = {
  TEXT: 'text',
  IMAGE: 'image',
  FILE: 'file',
  VIDEO: 'video',
} as const;

export type MessageType = typeof MESSAGE_TYPE[keyof typeof MESSAGE_TYPE];

export const MESSAGE_STATUS = {
  SENT: 'sent',
  SEEN: 'seen',
  FAILED: 'failed',
} as const;

export type MessageStatus = typeof MESSAGE_STATUS[keyof typeof MESSAGE_STATUS];

export type UserMessage = {
  conversationId: string
  senderId: string
  type: MessageType
  content: string
  attachments: Attachments[]
  status: MessageStatus,
  createdAt: string,
  updatedAt: string,
}

export type Attachments = {
  type: Extract<MessageType, "image" | "file" | "video">,
  url: string,
  fileName?: string,
  fileSize?: number,
  mimeType?: string,
  thumbnail?: string,
  duration?: number,
  width?: number,
  height?: number,
}

export const CONVERSATION_TYPE = {
  DIRECT: 'direct',
  SUPPORT: 'organization',
} as const;

export type ConversationType = typeof CONVERSATION_TYPE[keyof typeof CONVERSATION_TYPE];

export const SUPPORT_CONVERSATION_STATUS = {
  QUEUE: "queue",
  IN_PROGRESS: "in_progress",
  CLOSED: "closed",
} as const;

export type SupportConversationStatus = typeof SUPPORT_CONVERSATION_STATUS[keyof typeof SUPPORT_CONVERSATION_STATUS];

export type ConversationPartner = {
  id: string;
  displayName: Nullable<string>;
  email: Nullable<string>;
  avatarUrl: Nullable<string>;
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

export type ConversationLastMessage = {
  senderId: Nullable<string>;
  content: string;
  timestamp: Nullable<string>;
};

export type DirectConversation = {
  conversationId: string,
  lastMessage: Nullable<ConversationLastMessage>,
  partner: Nullable<ConversationPartner>,
  unreadCount: number,
  createdAt: string,
  updatedAt: string
}

export type Conversation = DirectConversation & {
  type: ConversationType;
  orgId: Nullable<string>;
  status: Nullable<SupportConversationStatus>;
  assignedStaffId: Nullable<string>;
}

export type ConversationParticipant = {
  conversationId: string
  memberId: Nullable<string>,
  role: "customer" | "staff",
  isActive: boolean,
  nickName: Nullable<string>,
  unreadCount: number,
  lastReadAt: Nullable<string>,
  lastReadMessageId: Nullable<string>,
  deletedAt: Nullable<string>,
  createdAt: string,
  updatedAt: string
}

