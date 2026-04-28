import { updateMyQrNote } from "@/src/features/qr/api";
import { QR_CODES_ME_NOTE_QUERY_KEY, QR_UPDATE_DESIGN_MUTATION_KEY } from "@/src/features/qr/constants";
import type { UpdateMyQrNotePayload } from "@/src/features/qr/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

export const useUpdateQRNote = () => {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationKey: QR_UPDATE_DESIGN_MUTATION_KEY,
    mutationFn: async (request: UpdateMyQrNotePayload) => {
      const response = await updateMyQrNote(request);
      if (!response.success)
        throw new Error(response.error?.message ?? "Failed to update QR note");
      return response.data;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: QR_CODES_ME_NOTE_QUERY_KEY });
    },
  });

  const error = useMemo(() => {
    if (!mutation.error) return null;
    if (mutation.error instanceof Error) return mutation.error;
    return new Error("Update QR note failed");
  }, [mutation.error]); 

  return {
    updateNote: mutation.mutateAsync,
    data: mutation.data,
    isUpdatingNote: mutation.isPending,
    error,
    reset: mutation.reset,
  };
};
