
export const PREFIX_PATH_POST = "/(protected)/posts";
export const POST_CREATE_API = 'core/posts';

export const POST_ROUTE = {
  matching : (postId: string) => `/(protected)/posts/${postId}/matching`,
} as const;
