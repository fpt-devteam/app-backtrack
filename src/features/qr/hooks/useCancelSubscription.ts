import { cancelSubscription } from "@/src/features/qr/api";
import {
  QR_CANCEL_SUBSCRIPTION_MUTATION_KEY,
  QR_SUBSCRIPTION_ME_QUERY_KEY,
} from "@/src/features/qr/constants";
import { mapErrorToMessage } from "@/src/shared/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

export const useCancelSubscription = () => {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationKey: [...QR_CANCEL_SUBSCRIPTION_MUTATION_KEY],
    mutationFn: async () => {
      const response = await cancelSubscription();
      if (!response.success) throw new Error(response?.error?.code || "Failed to cancel subscription");
      return response.data;
    },

    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: QR_SUBSCRIPTION_ME_QUERY_KEY });
    },
  });

  const errorMessage = useMemo(() => {
    if (!mutation.error) return null;
    return mapErrorToMessage(mutation.error);
  }, [mutation.error]);

  return {
    cancelSubscription: mutation.mutateAsync,
    isCanceling: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: errorMessage,
    reset: mutation.reset,
  };
};
