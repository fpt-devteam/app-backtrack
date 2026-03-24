import { createDirectConversationApi } from "@/src/features/chat/api";
import { CHAT_QUERY_KEY } from "@/src/features/chat/constants";
import {
  DirectConversationCreateRequest,
  DirectConversationCreateResponse,
} from "@/src/features/chat/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

export const useCreateDirectConversation = () => {
  const qc = useQueryClient();

  const mutation = useMutation<
    DirectConversationCreateResponse,
    Error,
    DirectConversationCreateRequest
  >({
    mutationKey: CHAT_QUERY_KEY.createDirectConversation,
    mutationFn: async (req) => {
      const response = await createDirectConversationApi(req);
      return response;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CHAT_QUERY_KEY.conversations });
    },
  });

  const error = useMemo(() => {
    if (!mutation.error) return null;
    if (mutation.error instanceof Error) return mutation.error;
    return new Error("Send message failed");
  }, [mutation.error]);

  return {
    create: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error,
  };
};
