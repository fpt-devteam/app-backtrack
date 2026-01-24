import { syncExpoPushToken } from "@/src/features/notification/api";
import type { SyncExpoPushTokenRequest } from "@/src/features/notification/types";
import { useMutation } from "@tanstack/react-query";

export const useSyncExpoPushToken = () => {
  const mutation = useMutation<void, Error, SyncExpoPushTokenRequest>({
    mutationFn: syncExpoPushToken,
  });

  return mutation;
};
