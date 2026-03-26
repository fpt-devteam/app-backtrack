import { createConversationApi } from "@/src/features/chat/api";
import {
  CHAT_QUERY_KEY,
  createMockConversation,
  IS_CHAT_FEATURE_MOCK,
} from "@/src/features/chat/constants";
import type { ConversationCreateRequest } from "@/src/features/chat/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

export const useCreateConversation = () => {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationKey: CHAT_QUERY_KEY.conversationCreate,
    mutationFn: async (request: ConversationCreateRequest) => {
      if (IS_CHAT_FEATURE_MOCK) {
        return createMockConversation(request);
      }

      const response = await createConversationApi(request);
      if (!response?.success || !response.data?.conversation) {
        throw new Error("Failed to create conversation");
      }

      return response.data.conversation;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CHAT_QUERY_KEY.conversations });
    },
  });

  const error = useMemo(() => {
    if (!mutation.error) return null;
    if (mutation.error instanceof Error) return mutation.error;
    return new Error("Create conversation failed");
  }, [mutation.error]);

  return {
    data: mutation.data,
    createConversation: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error,
    reset: mutation.reset,
  };
};
