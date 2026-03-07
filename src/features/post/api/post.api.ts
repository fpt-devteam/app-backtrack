import type { AnalyzeImageRequest, AnalyzeImageResponse, GetAllMyPostResponse, MatchingPostsRequest, MatchingPostsResponse, Post, PostCreateRequest, PostsRequest, PostsResponse } from "@/src/features/post/types";
import { type ApiResponse, privateClient } from "@/src/shared/api";

export const POST_API = {
  create: "/api/core/posts",
  filter: "/api/core/posts",
  detail: (postId: string) => `/api/core/posts/${postId}`,
  matching: (postId: string) => `/api/core/posts/${postId}/similar`,
  analyzeImage: "/api/core/image-analysis/analyze",
  getAllMyPost: "/api/core/posts/me"
} as const;

export async function filterPostsApi(params: PostsRequest) {
  const response = await privateClient.get<PostsResponse>(POST_API.filter, { params });
  return response.data;
}

export const createPost = async (req: PostCreateRequest) => {
  const response = await privateClient.post(POST_API.create, req, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data as ApiResponse<Post>;
};

export async function getPostByIdApi(postId: string) {
  const response = await privateClient.get<ApiResponse<Post>>(POST_API.detail(postId));
  return response.data;
}

export async function matchingPostsApi(req: MatchingPostsRequest) {
  const response = await privateClient.get<MatchingPostsResponse>(POST_API.matching(req.postId));
  return response.data;
}

export async function analyzeImageApi(req: AnalyzeImageRequest) {
  const response = await privateClient.post<AnalyzeImageResponse>(POST_API.analyzeImage, req, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
}

export async function getAllMyPost() {
  const response = await privateClient.get<GetAllMyPostResponse>(POST_API.getAllMyPost);
  return response.data;
}
