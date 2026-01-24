import { updateReadStatus } from "@/src/features/notification/api";
import { notificationKeys } from "@/src/features/notification/constants";
import type { UpdateReadStatusRequest } from "@/src/features/notification/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateNotificationReadStatus = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<void, Error, UpdateReadStatusRequest>({
    mutationFn: updateReadStatus,
    onSuccess: () => {
      // Invalidate all notification lists to trigger refetch
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
    },
  });

  return mutation;
};
