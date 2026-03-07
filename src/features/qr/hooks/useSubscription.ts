import { subscription } from "@/src/features/qr/api";
import {
  QR_CODES_ME_QUERY_KEY,
  QR_SUBSCRIBE_MUTATION_KEY,
  QR_SUBSCRIPTION_ME_QUERY_KEY,
} from "@/src/features/qr/constants";
import type { SubscriptionRequest } from "@/src/features/qr/types";
import { mapErrorToMessage } from "@/src/shared/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

export const useSubscription = () => {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationKey: [...QR_SUBSCRIBE_MUTATION_KEY],
    mutationFn: async (req: SubscriptionRequest) => {
      const response = await subscription(req);
      if (!response.success) throw new Error("Failed to subscribe");
      return response.data;
    },

    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: QR_SUBSCRIPTION_ME_QUERY_KEY });
      await qc.invalidateQueries({ queryKey: QR_CODES_ME_QUERY_KEY });
    },
  });

  const errorMessage = useMemo(() => {
    if (!mutation.error) return null;
    return mapErrorToMessage(mutation.error);
  }, [mutation.error]);

  return {
    subscribe: mutation.mutateAsync,
    isSubscribing: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: errorMessage,
    reset: mutation.reset,
  };
};
