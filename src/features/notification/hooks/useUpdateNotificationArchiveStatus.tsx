import { updateArchiveStatus } from "@/src/features/notification/api";
import { notificationKeys } from "@/src/features/notification/constants";
import type { UpdateArchiveStatusRequest } from "@/src/features/notification/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateNotificationArchiveStatus = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<void, Error, UpdateArchiveStatusRequest>({
    mutationFn: updateArchiveStatus,
    onSuccess: () => {
      // Invalidate all notification lists to trigger refetch
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
    },
  });

  return mutation;
};
