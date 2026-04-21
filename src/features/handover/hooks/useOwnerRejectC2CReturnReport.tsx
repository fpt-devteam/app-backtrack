import { rejectC2CReturnReportApi } from "@/src/features/handover/api";
import {
  C2C_RETURN_REPORT_DETAIL_QUERY_KEY,
  C2C_RETURN_REPORTS_QUERY_KEY,
  OWNER_REJECT_C2C_RETURN_REPORT_KEY,
} from "@/src/features/handover/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

export const useOwnerRejectC2CReturnReport = () => {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationKey: OWNER_REJECT_C2C_RETURN_REPORT_KEY,
    mutationFn: async (id: string) => {
      const response = await rejectC2CReturnReportApi(id);
      if (!response.success) throw new Error("Failed to reject return report");
      return response.data;
    },
    onSuccess: async (_, id) => {
      qc.invalidateQueries({ queryKey: C2C_RETURN_REPORTS_QUERY_KEY });
      qc.invalidateQueries({
        queryKey: [...C2C_RETURN_REPORT_DETAIL_QUERY_KEY, id],
      });
    },
  });

  const error = useMemo(() => {
    if (!mutation.error) return null;
    if (mutation.error instanceof Error) return mutation.error;
    return new Error("Failed to reject return report");
  }, [mutation.error]);

  return {
    ownerReject: mutation.mutateAsync,
    isRejecting: mutation.isPending,
    error,
  };
};
