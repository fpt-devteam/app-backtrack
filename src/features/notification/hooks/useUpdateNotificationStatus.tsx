import { updateStatusNotifications } from "@/src/features/notification/api/notification.api";
import {
  NOTIFICATION_UPDATE_STATUS_KEY,
  NOTIFICATIONS_QUERY_KEY,
} from "@/src/features/notification/constants";
import type { NotificationStatusUpdateRequest } from "@/src/features/notification/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

export const useUpdateNotificationStatus = () => {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationKey: NOTIFICATION_UPDATE_STATUS_KEY,
    mutationFn: async (request: NotificationStatusUpdateRequest) => {
      await updateStatusNotifications(request);
    },

    onSuccess: async () => {
      qc.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    },
  });

  const error = useMemo(() => {
    if (!mutation.error) return null;
    if (mutation.error instanceof Error) return mutation.error;
    return new Error("Update notification status failed");
  }, [mutation.error]);

  return {
    updateStatus: mutation.mutateAsync,
    isUpdatingStatus: mutation.isPending,
    error,
    reset: mutation.reset,
  };
};
