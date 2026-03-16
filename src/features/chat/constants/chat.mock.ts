import type {
  Conversation,
  ConversationPartner,
  ConversationType,
  Message,
} from "@/src/features/chat/types";
import type {
  ConversationCreateRequest,
  MessageSendRequest,
  MessageSendResponse,
} from "@/src/features/chat/types/chat.dto";
import type { CursorPaginationParams } from "@/src/shared/api";

export const IS_CHAT_FEATURE_MOCK = false;

const MOCK_ME_ID = "user_me_001";

const now = Date.now();

const makePartner = (
  id: string,
  displayName: string,
  email: string,
  avatarUrl: string,
): ConversationPartner => ({
  id,
  displayName,
  email,
  avatarUrl,
});

const PARTNERS: ConversationPartner[] = [
  makePartner(
    "user_partner_001",
    "Mia Tran",
    "mia.tran@example.com",
    "https://i.pravatar.cc/150?img=32",
  ),
  makePartner(
    "user_partner_002",
    "Noah Le",
    "noah.le@example.com",
    "https://i.pravatar.cc/150?img=33",
  ),
  makePartner(
    "user_partner_003",
    "Ava Nguyen",
    "ava.nguyen@example.com",
    "https://i.pravatar.cc/150?img=34",
  ),
  makePartner(
    "user_partner_004",
    "Liam Pham",
    "liam.pham@example.com",
    "https://i.pravatar.cc/150?img=35",
  ),
  makePartner(
    "user_partner_005",
    "Olivia Do",
    "olivia.do@example.com",
    "https://i.pravatar.cc/150?img=36",
  ),
];

const initialConversations: Conversation[] = [
  {
    conversationId: "conv_mock_001",
    type: "personal",
    partner: PARTNERS[0],
    orgId: null,
    lastMessage: {
      senderId: PARTNERS[0].id,
      content: "I found a black wallet near Gate C. Is it yours?",
      timestamp: new Date(now - 10 * 60 * 1000).toISOString(),
    },
    unreadCount: 1,
    createdAt: new Date(now - 12 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(now - 10 * 60 * 1000).toISOString(),
  },
  {
    conversationId: "conv_mock_002",
    type: "personal",
    partner: PARTNERS[1],
    orgId: null,
    lastMessage: {
      senderId: MOCK_ME_ID,
      content: "Thanks, I can pick it up after 6 PM.",
      timestamp: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
    },
    unreadCount: 0,
    createdAt: new Date(now - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    conversationId: "conv_mock_003",
    type: "organization",
    partner: PARTNERS[2],
    orgId: "org_mock_001",
    lastMessage: {
      senderId: PARTNERS[2].id,
      content: "Please share a photo of the keychain for verification.",
      timestamp: new Date(now - 4 * 60 * 60 * 1000).toISOString(),
    },
    unreadCount: 2,
    createdAt: new Date(now - 9 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(now - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    conversationId: "conv_mock_004",
    type: "personal",
    partner: PARTNERS[3],
    orgId: null,
    lastMessage: {
      senderId: MOCK_ME_ID,
      content: "I just arrived at the reception desk.",
      timestamp: new Date(now - 24 * 60 * 60 * 1000).toISOString(),
    },
    unreadCount: 0,
    createdAt: new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(now - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    conversationId: "conv_mock_005",
    type: "personal",
    partner: PARTNERS[4],
    orgId: null,
    lastMessage: {
      senderId: PARTNERS[4].id,
      content: "Can you confirm the serial number?",
      timestamp: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    unreadCount: 1,
    createdAt: new Date(now - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const initialMessages: Record<string, Message[]> = {
  conv_mock_001: [
    {
      id: "msg_mock_001_001",
      conversationId: "conv_mock_001",
      senderId: MOCK_ME_ID,
      type: "text",
      content: "Hi Mia, did you happen to find a black wallet?",
      status: "sent",
      createdAt: new Date(now - 30 * 60 * 1000).toISOString(),
      updatedAt: new Date(now - 30 * 60 * 1000).toISOString(),
    },
    {
      id: "msg_mock_001_002",
      conversationId: "conv_mock_001",
      senderId: PARTNERS[0].id,
      type: "text",
      content: "Yes, I picked one up near Gate C.",
      status: "sent",
      createdAt: new Date(now - 20 * 60 * 1000).toISOString(),
      updatedAt: new Date(now - 20 * 60 * 1000).toISOString(),
    },
    {
      id: "msg_mock_001_003",
      conversationId: "conv_mock_001",
      senderId: PARTNERS[0].id,
      type: "text",
      content: "I found a black wallet near Gate C. Is it yours?",
      status: "sent",
      createdAt: new Date(now - 10 * 60 * 1000).toISOString(),
      updatedAt: new Date(now - 10 * 60 * 1000).toISOString(),
    },
  ],
  conv_mock_002: [
    {
      id: "msg_mock_002_001",
      conversationId: "conv_mock_002",
      senderId: PARTNERS[1].id,
      type: "text",
      content: "I can hand over the item today.",
      status: "sent",
      createdAt: new Date(now - 3 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now - 3 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "msg_mock_002_002",
      conversationId: "conv_mock_002",
      senderId: MOCK_ME_ID,
      type: "text",
      content: "Thanks, I can pick it up after 6 PM.",
      status: "sent",
      createdAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
    },
  ],
  conv_mock_003: [
    {
      id: "msg_mock_003_001",
      conversationId: "conv_mock_003",
      senderId: MOCK_ME_ID,
      type: "text",
      content: "I lost my keys near your office.",
      status: "sent",
      createdAt: new Date(now - 5 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now - 5 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "msg_mock_003_002",
      conversationId: "conv_mock_003",
      senderId: PARTNERS[2].id,
      type: "text",
      content: "Please share a photo of the keychain for verification.",
      status: "sent",
      createdAt: new Date(now - 4 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now - 4 * 60 * 60 * 1000).toISOString(),
    },
  ],
  conv_mock_004: [
    {
      id: "msg_mock_004_001",
      conversationId: "conv_mock_004",
      senderId: PARTNERS[3].id,
      type: "text",
      content: "The item is at the reception desk now.",
      status: "sent",
      createdAt: new Date(now - 26 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now - 26 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "msg_mock_004_002",
      conversationId: "conv_mock_004",
      senderId: MOCK_ME_ID,
      type: "text",
      content: "I just arrived at the reception desk.",
      status: "sent",
      createdAt: new Date(now - 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now - 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  conv_mock_005: [
    {
      id: "msg_mock_005_001",
      conversationId: "conv_mock_005",
      senderId: PARTNERS[4].id,
      type: "text",
      content: "Can you confirm the serial number?",
      status: "sent",
      createdAt: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
};

let conversationsDb: Conversation[] = [...initialConversations];
let messagesDb: Record<string, Message[]> = { ...initialMessages };

const delay = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms));

const toTimestamp = (value?: string | null): number => {
  if (!value) return 0;
  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

const clone = <T,>(value: T): T => structuredClone(value);

const sortConversationsDesc = (items: Conversation[]) => {
  return [...items].sort((a, b) => toTimestamp(b.updatedAt) - toTimestamp(a.updatedAt));
};

const sortMessagesDesc = (items: Message[]) => {
  return [...items].sort((a, b) => toTimestamp(b.createdAt) - toTimestamp(a.createdAt));
};

export const getMockConversations = async (params: CursorPaginationParams) => {
  await delay();

  const sorted = sortConversationsDesc(conversationsDb);
  const filtered = params.cursor
    ? sorted.filter((conversation) => toTimestamp(conversation.updatedAt) < toTimestamp(params.cursor))
    : sorted;

  const limit = params.limit ?? 10;
  const selected = filtered.slice(0, limit);

  return {
    conversations: clone(selected),
    nextCursor: selected.length === limit ? selected.at(-1)?.updatedAt ?? null : null,
    hasMore: filtered.length > selected.length,
  };
};

export const getMockConversationDetail = async (conversationId: string) => {
  await delay(120);
  const conversation = conversationsDb.find((item) => item.conversationId === conversationId) ?? null;
  return clone(conversation);
};

export const getMockMessages = async (
  conversationId: string,
  params: CursorPaginationParams,
) => {
  await delay();

  const allMessages = sortMessagesDesc(messagesDb[conversationId] ?? []);
  const filtered = params.cursor
    ? allMessages.filter((message) => toTimestamp(message.createdAt) < toTimestamp(params.cursor))
    : allMessages;

  const limit = params.limit ?? 10;
  const selected = filtered.slice(0, limit);

  return {
    messages: clone(selected),
    nextCursor: selected.length === limit ? selected.at(-1)?.createdAt ?? null : null,
    hasMore: filtered.length > selected.length,
  };
};

const createConversationFromRequest = (
  request: ConversationCreateRequest,
  partner: ConversationPartner,
): Conversation => {
  const conversationId = `conv_mock_${Date.now()}`;
  const conversationType: ConversationType = request.type;
  const createdAt = new Date().toISOString();

  return {
    conversationId,
    type: conversationType,
    partner,
    orgId: request.type === "organization" ? "org_mock_new" : null,
    lastMessage: null,
    unreadCount: 0,
    createdAt,
    updatedAt: createdAt,
  };
};

export const createMockConversation = async (request: ConversationCreateRequest) => {
  await delay(140);

  const existing = conversationsDb.find(
    (conversation) => conversation.partner?.id === request.memberId,
  );

  if (existing) {
    return clone(existing);
  }

  const fallbackPartner =
    PARTNERS.find((partner) => partner.id === request.memberId) ??
    makePartner(
      request.memberId,
      "New Chat",
      "new.chat@example.com",
      "https://i.pravatar.cc/150?img=48",
    );

  const createdConversation = createConversationFromRequest(request, fallbackPartner);
  conversationsDb = sortConversationsDesc([createdConversation, ...conversationsDb]);
  messagesDb[createdConversation.conversationId] = [];

  return clone(createdConversation);
};

export const sendMockMessage = async (
  payload: MessageSendRequest,
): Promise<MessageSendResponse> => {
  await delay(120);

  const conversationId = payload.conversationId;
  if (!conversationId) {
    throw new Error("Missing conversationId");
  }

  const conversation = conversationsDb.find((item) => item.conversationId === conversationId);
  if (!conversation) {
    throw new Error("Conversation not found");
  }

  const createdAt = new Date().toISOString();
  const newMessage: Message = {
    id: `msg_mock_${Date.now()}`,
    conversationId,
    senderId: MOCK_ME_ID,
    type: payload.type ?? "text",
    content: payload.content,
    status: "sent",
    createdAt,
    updatedAt: createdAt,
  };

  messagesDb[conversationId] = [newMessage, ...(messagesDb[conversationId] ?? [])];

  const updatedConversation: Conversation = {
    ...conversation,
    lastMessage: {
      senderId: MOCK_ME_ID,
      content: payload.content,
      timestamp: createdAt,
    },
    updatedAt: createdAt,
  };

  conversationsDb = conversationsDb.map((item) =>
    item.conversationId === conversationId ? updatedConversation : item,
  );
  conversationsDb = sortConversationsDesc(conversationsDb);

  return {
    conversationId,
    message: clone(newMessage),
    isNewConversation: false,
  };
};
