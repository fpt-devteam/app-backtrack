import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { matchingPostsApi } from '../api';
import { POST_MATCHING_QUERY_KEY } from '../constants';
import type { MatchingPostsRequest, MatchingPostsResponse } from '../types';
import { PostMatchingStatus } from '../types';

const TIME_INTERVAL_MS = 2000;

const useMatchingPost = (postId: string) => {
  const query = useQuery<MatchingPostsResponse>({
    queryKey: [...POST_MATCHING_QUERY_KEY, postId],
    queryFn: async () => {
      const request: MatchingPostsRequest = { postId };
      const response = await matchingPostsApi(request);
      if (!response?.success) throw new Error("Matching failed");
      if (!response?.data?.embeddingStatus) throw new Error("Matching failed");
      return response;
    },
    refetchInterval: (query) => {
      const status = query.state.data?.data?.embeddingStatus;
      return status === PostMatchingStatus.Ready ? false : TIME_INTERVAL_MS;
    },
  });

  const error = useMemo(() => {
    if (!query.error) return null;
    if (query.error instanceof Error) return query.error;
    return new Error("Matching failed");
  }, [query.error]);

  return {
    error,
    isMatching: query?.data?.data?.embeddingStatus !== PostMatchingStatus.Ready,
    similarPosts: query?.data?.data?.similarPosts || [],
    retry: query.refetch,
  };
};

export default useMatchingPost;
