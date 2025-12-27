import { privateClient } from "@/src/api/common/client";
import type { PostsRequest, PostsResponse } from "@/src/features/post/types";

const POSTS = {
  filter: "/core/posts",
  detail: (id: string) => `/core/posts/${id}`,
} as const;

export async function filterPostsApi(params: PostsRequest = {}) {
  const response = await privateClient.get<PostsResponse>(POSTS.filter, {
    params: {
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 10,
      ...(params.postType && { postType: params.postType }),
      ...(params.searchTerm ? { searchTerm: params.searchTerm } : {}),
      ...(params.location?.latitude !== undefined ? { latitude: params.location.latitude } : {}),
      ...(params.location?.longitude !== undefined ? { longitude: params.location.longitude } : {}),
      ...(params.radiusInKm != undefined ? { radiusInKm: params.radiusInKm } : {}),
    },
  });

  return response.data;
}

// export async function getPostByIdApi(id: string) {
//   const response = await privateClient.get<ApiResponse<PostResponse>>(POSTS.detail(id));
//   return response.data;
// }
