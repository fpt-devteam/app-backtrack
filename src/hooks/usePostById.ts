import { getPostById } from '@/src/api/posts';
import type { ApiResponse, PostDetail } from '@/src/types/post.type';
import { useCallback, useEffect, useState } from 'react';

interface UsePostByIdState {
  post: PostDetail | null;
  loading: boolean;
  error: string | null;
  notFound: boolean;
}

interface UsePostByIdReturn extends UsePostByIdState {
  retry: () => void;
}

export const usePostById = (id: string | null): UsePostByIdReturn => {
  const [state, setState] = useState<UsePostByIdState>({
    post: null,
    loading: true,
    error: null,
    notFound: false,
  });

  const fetchPost = useCallback(async () => {
    if (!id) {
      setState({
        post: null,
        loading: false,
        error: 'No post ID provided',
        notFound: false,
      });
      return;
    }

    setState((prev) => ({
      ...prev,
      loading: true,
      error: null,
      notFound: false,
    }));

    try {
      const response: ApiResponse<PostDetail> = await getPostById(id);

      if (!response.success || !response.data) {
        if (response.error?.statusCode === 404) {
          setState({
            post: null,
            loading: false,
            error: 'Post not found',
            notFound: true,
          });
          return;
        }

        throw new Error(response.error?.message || 'Failed to fetch post');
      }

      setState({
        post: response.data,
        loading: false,
        error: null,
        notFound: false,
      });
    } catch (error: any) {
      if (error.response?.status === 404) {
        setState({
          post: null,
          loading: false,
          error: 'Post not found',
          notFound: true,
        });
        return;
      }

      setState({
        post: null,
        loading: false,
        error: error.message || 'An error occurred while fetching the post',
        notFound: false,
      });
    }
  }, [id]);

  const retry = useCallback(() => {
    fetchPost();
  }, [fetchPost]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  return {
    ...state,
    retry,
  };
};
