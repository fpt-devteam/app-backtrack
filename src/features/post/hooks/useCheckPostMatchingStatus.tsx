import { checkPostMatchingStatusApi } from "@/src/features/post/api";
import { POST_MATCHING_QUERY_KEY } from "@/src/features/post/constants";
import type {
  PostMatchingStatusCheckRequest,
  PostMatchingStatusCheckResponse,
} from "@/src/features/post/types";
import { PostMatchingStatus } from "@/src/features/post/types";
import { Optional } from "@/src/shared/types/global.type";
import { useQuery } from "@tanstack/react-query";

const TIME_INTERVAL_MS = 3000;

export const useCheckPostMatchingStatus = (postId: Optional<string>) => {
  const isPostMatchingCompleted = (status: PostMatchingStatus | undefined) => {
    if (!status) return false;
    return status === PostMatchingStatus.Completed;
  };

  const query = useQuery<PostMatchingStatusCheckResponse>({
    queryKey: [...POST_MATCHING_QUERY_KEY, "status", postId],
    enabled: !!postId,
    queryFn: async () => {
      if (!postId) throw new Error("Post ID is required");
      const request: PostMatchingStatusCheckRequest = { postId };
      const response = await checkPostMatchingStatusApi(request);

      if (!response?.success || !response?.data?.matchingStatus)
        throw new Error("Matching failed");

      return response;
    },

    refetchInterval: (query) => {
      const status = query.state.data?.data?.matchingStatus;
      return isPostMatchingCompleted(status) ? false : TIME_INTERVAL_MS;
    },
  });

  return {
    isMatching: !isPostMatchingCompleted(query?.data?.data?.matchingStatus),
  };
};
