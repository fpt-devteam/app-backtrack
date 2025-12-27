
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { POST_CREATE_KEY, POSTS_QUERY_KEY } from '../constants';
import { createPost } from '../services/post.service';
import { PostCreateRequest } from '../types';

export const useCreatePost = () => {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationKey: POST_CREATE_KEY,
    mutationFn: async (request: PostCreateRequest) => {
      const response = await createPost(request);
      if (!response) return null;
      return response.data;
    },

    onSuccess: async () => {
      qc.invalidateQueries({ queryKey: POSTS_QUERY_KEY });
    },
  });

  const error = useMemo(() => {
    if (!mutation.error) return null;
    if (mutation.error instanceof Error) return mutation.error;
    return new Error("Create post failed");
  }, [mutation.error]);

  return {
    createPost: mutation.mutateAsync,
    isCreatingPost: mutation.isPending,
    error,
  }
}
