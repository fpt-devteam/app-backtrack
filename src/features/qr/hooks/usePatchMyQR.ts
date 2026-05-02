import { patchMyQR } from "@/src/features/qr/api";
import {
    QR_CODES_ME_QUERY_KEY,
    QR_PATCH_ME_MUTATION_KEY,
} from "@/src/features/qr/constants";
import type { PatchMyQrPayload } from "@/src/features/qr/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

export const usePatchMyQR = () => {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationKey: QR_PATCH_ME_MUTATION_KEY,
    mutationFn: async (payload: PatchMyQrPayload) => {
      const response = await patchMyQR(payload);
      if (!response.success)
        throw new Error(response.error?.message ?? "Failed to update QR");
      return response.data;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: [...QR_CODES_ME_QUERY_KEY] });
    },
  });

  const error = useMemo(() => {
    if (!mutation.error) return null;
    if (mutation.error instanceof Error) return mutation.error;
    return new Error("Patch QR failed");
  }, [mutation.error]);

  return {
    patchMyQR: mutation.mutateAsync,
    isPatchingQR: mutation.isPending,
    error,
    reset: mutation.reset,
  };
};
