import type {
  ApiResponse,
  GetPostsParams,
  PagedResponse,
  PostResponse,
} from '@/src/types/post.type';
import { privateClient } from '../common/client';

export const getPosts = async (
  params: GetPostsParams = {}
): Promise<ApiResponse<PagedResponse<PostResponse>>> => {
  const response = await privateClient.get<ApiResponse<PagedResponse<PostResponse>>>('core/posts', {
    params: {
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 20,
      ...(params.postType && { postType: params.postType }),
      ...(params.searchTerm && { searchTerm: params.searchTerm }),
      ...(params.latitude !== undefined && { latitude: params.latitude }),
      ...(params.longitude !== undefined && { longitude: params.longitude }),
      ...(params.radiusInKm !== undefined && { radiusInKm: params.radiusInKm }),
    },
  });
  return response.data;
};

export const getPostById = async (id: string): Promise<ApiResponse<PostResponse>> => {
  const response = await privateClient.get<ApiResponse<PostResponse>>(`core/posts/${id}`);
  return response.data;
};
