import { useQuery } from '@tanstack/react-query'
import { getConversationDetailApi } from '../api'
import { CHAT_QUERY_KEY } from '../constants'

const useConversationDetail = (conversationId: string) => {
  const query = useQuery({
    queryKey: CHAT_QUERY_KEY.conversationDetail(conversationId),
    queryFn: async () => {
      const response = await getConversationDetailApi(conversationId)
      if (!response?.success) throw new Error('Failed to fetch conversation detail')
      return response.data
    },
    enabled: !!conversationId,
  })

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}

export default useConversationDetail
