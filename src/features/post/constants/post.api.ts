export const POST_API = {
  create: "/core/posts",
  filter: "/core/posts",
  detail: (postId: string) => `/core/posts/${postId}`,
  matching: (postId: string) => `/core/posts/${postId}/similar`,
} as const;
