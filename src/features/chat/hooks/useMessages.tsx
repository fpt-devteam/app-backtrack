import { getMessagesApi } from "@/src/features/chat/api";
import { CHAT_QUERY_KEY } from "@/src/features/chat/constants";
import { DEFAULT_PAGE_SIZE } from "@/src/shared/constants";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useMessages = (conversationId: string) => {
  const query = useInfiniteQuery({
    queryKey: CHAT_QUERY_KEY.messages(conversationId),
    queryFn: async ({ pageParam }) => {
      const params = {
        cursor: pageParam || undefined,
        limit: DEFAULT_PAGE_SIZE,
      };

      const response = await getMessagesApi(conversationId, params);
      if (!response?.success) throw new Error("Failed to fetch messages");
      return response.data;
    },
    enabled: !!conversationId,
    getNextPageParam: (lastPage) => {
      return lastPage?.hasMore ? (lastPage.nextCursor ?? undefined) : undefined;
    },
    initialPageParam: undefined as string | undefined,
  });

  return {
    data: query.data?.pages.flatMap((page) => page?.messages || []) || [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
  };
};
