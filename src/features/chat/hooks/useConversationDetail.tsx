import { getConversationDetailApi } from "@/src/features/chat/api";
import {
  CHAT_QUERY_KEY,
  getMockConversationDetail,
  IS_CHAT_FEATURE_MOCK,
} from "@/src/features/chat/constants";
import { useQuery } from "@tanstack/react-query";

export const useConversationDetail = (conversationId: string) => {
  const query = useQuery({
    queryKey: CHAT_QUERY_KEY.conversationDetail(conversationId),
    queryFn: async () => {
      if (IS_CHAT_FEATURE_MOCK) {
        return getMockConversationDetail(conversationId);
      }

      const response = await getConversationDetailApi(conversationId);
      if (!response?.success)
        throw new Error("Failed to fetch conversation detail");
      return response.data?.conversation ?? null;
    },
    enabled: !!conversationId,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
