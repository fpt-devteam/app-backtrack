import { checkPostMatchingStatusApi } from "@/src/features/post/api";
import { POST_MATCHING_QUERY_KEY } from "@/src/features/post/constants";
import { IS_MATCHING_POST_MOCK } from "@/src/features/post/constants/post.mock";
import type {
  PostMatchingStatusCheckRequest,
  PostMatchingStatusCheckResponse,
} from "@/src/features/post/types";
import { PostMatchingStatus } from "@/src/features/post/types";
import { useQuery } from "@tanstack/react-query";

const TIME_INTERVAL_MS = 3000;

export const useCheckPostMatchingStatus = (postId: string) => {
  const isPostMatchingCompleted = (status: PostMatchingStatus | undefined) => {
    if (!status) return false;
    return status === PostMatchingStatus.Completed;
  };

  const query = useQuery<PostMatchingStatusCheckResponse>({
    queryKey: [...POST_MATCHING_QUERY_KEY, "status", postId],
    enabled: !IS_MATCHING_POST_MOCK,
    queryFn: async () => {
      const request: PostMatchingStatusCheckRequest = { postId };
      const response = await checkPostMatchingStatusApi(request);
      if (!response?.success) throw new Error("Matching failed");
      if (!response?.data?.matchingStatus) throw new Error("Matching failed");
      return response;
    },

    refetchInterval: (query) => {
      const status = query.state.data?.data?.matchingStatus;
      return isPostMatchingCompleted(status) ? false : TIME_INTERVAL_MS;
    },
  });

  return {
    isMatching: IS_MATCHING_POST_MOCK
      ? false
      : !isPostMatchingCompleted(query?.data?.data?.matchingStatus),
  };
};
