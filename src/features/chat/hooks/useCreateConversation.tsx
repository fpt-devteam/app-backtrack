import { useMutation } from '@tanstack/react-query';
import { useMemo } from 'react';
import { createConversationApi } from '../api';
import { CHAT_QUERY_KEY } from '../constants';
import { ConversationCreateRequest, ConversationCreateResponse } from '../types/chat.dto';

const useCreateConversation = () => {
  const mutation = useMutation<ConversationCreateResponse, Error, ConversationCreateRequest>({
    mutationKey: CHAT_QUERY_KEY.conversationCreate,
    mutationFn: async (req) => {
      const response = await createConversationApi(req);
      if (!response?.success) throw new Error("Failed to create conversation");
      return response;
    },
  });

  const error = useMemo(() => {
    if (!mutation.error) return null;
    if (mutation.error instanceof Error) return mutation.error;
    return new Error("Create conversation failed");
  }, [mutation.error]);

  return ({
    createConversation: mutation.mutateAsync,
    isCreatingConversation: mutation.isPending,
    error,
  });
};

export default useCreateConversation;
