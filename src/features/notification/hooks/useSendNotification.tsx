import { sendNotificationApi } from "@/src/features/notification/api/notification.api";
import { NOTIFICATION_SEND_KEY } from "@/src/features/notification/constants";
import type { NotificationSendRequest } from "@/src/features/notification/types";
import { useMutation } from "@tanstack/react-query";
import { useMemo } from "react";

export const useSendNotification = () => {
  const mutation = useMutation({
    mutationKey: NOTIFICATION_SEND_KEY,
    mutationFn: async (request: NotificationSendRequest) => {
      const response = await sendNotificationApi(request);
      return response;
    },
  });

  const error = useMemo(() => {
    if (!mutation.error) return null;
    if (mutation.error instanceof Error) return mutation.error;
    return new Error("Send notification failed");
  }, [mutation.error]);

  return {
    sendNotification: mutation.mutateAsync,
    isSendingNotification: mutation.isPending,
    error,
    reset: mutation.reset,
  };
};
