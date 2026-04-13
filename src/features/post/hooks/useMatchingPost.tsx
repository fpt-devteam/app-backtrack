import { matchingPostsApi } from "@/src/features/post/api";
import { POST_MATCHING_QUERY_KEY } from "@/src/features/post/constants";
import type {
  MatchingPostsRequest,
  MatchingPostsResponse,
} from "@/src/features/post/types";
import {
  getMockMatchingPosts,
  IS_POST_MOCK,
} from "@/src/shared/mocks/post.mock";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useCheckPostMatchingStatus } from "./useCheckPostMatchingStatus";

export const useMatchingPost = (postId: string) => {
  const { isMatching } = useCheckPostMatchingStatus(postId);

  const query = useQuery<MatchingPostsResponse>({
    queryKey: [...POST_MATCHING_QUERY_KEY, "result", postId],
    enabled: !IS_POST_MOCK && !isMatching && !!postId,
    queryFn: async () => {
      if (IS_POST_MOCK)
        return {
          success: true,
          data: { similarPosts: getMockMatchingPosts(postId) },
        };

      const request: MatchingPostsRequest = { postId };
      const response = await matchingPostsApi(request);

      if (!response?.success) throw new Error("Matching failed");
      return response;
    },
  });

  const error = useMemo(() => {
    if (IS_POST_MOCK) return null;
    if (!query.error) return null;
    if (query.error instanceof Error) return query.error;
    return new Error("Matching failed");
  }, [query.error]);

  return {
    error,
    similarPosts: query?.data?.data?.similarPosts || [],
    isMatching: IS_POST_MOCK ? false : isMatching,
    isLoading: query.isLoading,
  };
};
