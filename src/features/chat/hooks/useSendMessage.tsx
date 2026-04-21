import { CHAT_QUERY_KEY } from "@/src/features/chat/constants";
import { socketChatService } from "@/src/features/chat/services";
import type {
  MessageSendRequest,
  MessageSendResponse,
} from "@/src/features/chat/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

type SendMessageParams = {
  conversationId: string;
  request: MessageSendRequest;
};

export const useSendMessage = () => {
  const qc = useQueryClient();
  const mutation = useMutation<MessageSendResponse, Error, SendMessageParams>({
    mutationKey: CHAT_QUERY_KEY.messageSend,
    mutationFn: async ({ conversationId, request }) => {
      await socketChatService.connect();
      socketChatService.joinConversation(conversationId);

      return socketChatService.sendMessage({
        conversationId,
        type: request.type ?? "text",
        content: request.content,
      });
    },
    onSuccess: (_res, vars) => {
      qc.invalidateQueries({
        queryKey: CHAT_QUERY_KEY.messages(vars.conversationId),
      });
      qc.invalidateQueries({ queryKey: CHAT_QUERY_KEY.conversations });
    },
  });

  const error = useMemo(() => {
    if (!mutation.error) return null;
    if (mutation.error instanceof Error) return mutation.error;
    return new Error("Send message failed");
  }, [mutation.error]);

  return {
    sendMessage: mutation.mutateAsync,
    isSendingMessage: mutation.isPending,
    error,
    reset: mutation.reset,
  };
};
