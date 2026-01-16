import { sendMessageApi } from '@/src/features/chat/api';
import { CHAT_QUERY_KEY } from '@/src/features/chat/constants';
import type { MessageSendRequest, MessageSendResponse } from '@/src/features/chat/types/chat.dto';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

type SendMessageParams = {
  conversationId: string;
  request: MessageSendRequest;
};

export const useSendMessage = () => {
  const qc = useQueryClient();
  const mutation = useMutation<MessageSendResponse, Error, SendMessageParams>({
    mutationKey: CHAT_QUERY_KEY.messageSend,
    mutationFn: async ({ conversationId, request }) => {
      const response = await sendMessageApi(conversationId, request);
      if (!response?.success) throw new Error("Failed to send message");
      return response;
    },
    onSuccess: (_res, vars) => {
      qc.invalidateQueries({ queryKey: CHAT_QUERY_KEY.messages(vars.conversationId) })
    }
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


