export const PROFILE_ROUTE = {
  index: "/(protected)/profile",
} as const;

export const POST_ROUTE = {
  index: "/(protected)/posts",
  create: "/(protected)/posts/create",
  details: (postId: string) => `/(protected)/posts/${postId}`,
  matching: (postId: string) => `/(protected)/posts/${postId}/matching`,
  detailMatch: (postId: string, otherPostId: string) => `/(protected)/posts/${postId}/matching/${otherPostId}`,
  search: "/(protected)/posts/search",
} as const;

export const CHAT_ROUTE = {
  conversations: `/(protected)/chat/conversations`,
  message: (conversationId: string) =>
    `/(protected)/chat/conversations/${conversationId}`,
} as const;
