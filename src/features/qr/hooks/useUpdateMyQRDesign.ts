import { updateMyQrDesign } from "@/src/features/qr/api";
import {
  IS_QR_FEATURE_MOCK,
  QR_CODES_ME_DESIGN_QUERY_KEY,
  QR_UPDATE_DESIGN_MUTATION_KEY,
} from "@/src/features/qr/constants";
import type { UpdateMyQrDesignPayload } from "@/src/features/qr/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useMemo } from "react";

export const useUpdateMyQRDesign = () => {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationKey: QR_UPDATE_DESIGN_MUTATION_KEY,
    mutationFn: async (request: UpdateMyQrDesignPayload) => {
      if (IS_QR_FEATURE_MOCK) {
        router.back();
        return;
      }

      const response = await updateMyQrDesign(request);
      if (!response.success) throw new Error(response.error?.message ?? "Failed to update QR design");
      return response.data;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: QR_CODES_ME_DESIGN_QUERY_KEY });
    },
  });

  const error = useMemo(() => {
    if (!mutation.error) return null;
    if (mutation.error instanceof Error) return mutation.error;
    return new Error("Update QR design failed");
  }, [mutation.error]);

  return {
    updateDesign: mutation.mutateAsync,
    data: mutation.data,
    isUpdatingDesign: mutation.isPending,
    error,
    reset: mutation.reset,
  };
};
