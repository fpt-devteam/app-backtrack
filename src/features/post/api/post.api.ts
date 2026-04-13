import type { AnalyzeImageRequest, AnalyzeImageResponse, GetAllMyPostResponse, MatchingPostsRequest, MatchingPostsResponse, PostCreateRequest, PostCreateResponse, PostFeedRequest, PostFeedResponse, PostGetByIdResponse, PostMatchingStatusCheckRequest, PostMatchingStatusCheckResponse, PostSearchRequest, PostSearchResponse } from "@/src/features/post/types";
import { privateClient, publicClient } from "@/src/shared/api";

export const POST_API = {
  create: "/api/core/posts",
  getFeed: "/api/core/posts/feed",
  search: "/api/core/posts/search",
  detail: (postId: string) => `/api/core/posts/${postId}`,
  matching: (postId: string) => `/api/core/posts/${postId}/similar`,
  checkPostMatchingStatus: (postId: string) => `/api/core/posts/${postId}/matching-status`,
  analyzeImage: "/api/core/post-image/analyze",
  getAllMyPost: "/api/core/posts/me"
} as const;

export async function getFeedPostsApi(params: PostFeedRequest) {
  const response = await publicClient.post<PostFeedResponse>(POST_API.getFeed, params);
  return response.data;
}

export const createPost = async (req: PostCreateRequest) => {
  const response = await privateClient.post<PostCreateResponse>(POST_API.create, req);
  return response.data;
};

export async function getPostByIdApi(postId: string) {
  const response = await privateClient.get<PostGetByIdResponse>(POST_API.detail(postId));
  return response.data;
}

export async function matchingPostsApi(req: MatchingPostsRequest) {
  const response = await privateClient.get<MatchingPostsResponse>(POST_API.matching(req.postId));
  return response.data;
}

export async function analyzeImageApi(req: AnalyzeImageRequest) {
  const response = await privateClient.post<AnalyzeImageResponse>(POST_API.analyzeImage, req);
  return response.data;
}

export async function getAllMyPost() {
  const response = await privateClient.get<GetAllMyPostResponse>(POST_API.getAllMyPost);
  return response.data;
}

export async function checkPostMatchingStatusApi(req: PostMatchingStatusCheckRequest) {
  const response = await privateClient.get<PostMatchingStatusCheckResponse>(POST_API.checkPostMatchingStatus(req.postId));
  return response.data;
}

export async function searchPost(req: PostSearchRequest) {
  const response = await privateClient.post<PostSearchResponse>(POST_API.search, req);
  return response.data;
}
