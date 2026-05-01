import { useAppUser } from "@/src/features/auth/providers";
import { activateC2CReturnReportApi } from "@/src/features/handover/api";
import {
  ACTIVATE_C2C_RETURN_REPORT_KEY,
  C2C_RETURN_REPORT_DETAIL_QUERY_KEY,
  C2C_RETURN_REPORTS_QUERY_KEY,
} from "@/src/features/handover/constants";
import { DeliverC2CReturnReportRequest } from "@/src/features/handover/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

export const useActivateC2CReturnReport = () => {
  const qc = useQueryClient();
  const { user: currentUser } = useAppUser();

  const mutation = useMutation({
    mutationKey: ACTIVATE_C2C_RETURN_REPORT_KEY,
    mutationFn: async (req: DeliverC2CReturnReportRequest) => {
      const response = await activateC2CReturnReportApi(req);
      if (!response.success) throw new Error("Failed to mark as delivered");
      return response.data;
    },
    onSuccess: async (_, id) => {
      qc.invalidateQueries({
        queryKey: [...C2C_RETURN_REPORTS_QUERY_KEY, currentUser?.id ?? null],
      });

      qc.invalidateQueries({
        queryKey: [...C2C_RETURN_REPORT_DETAIL_QUERY_KEY, id],
      });
    },
  });

  const error = useMemo(() => {
    if (!mutation.error) return null;
    if (mutation.error instanceof Error) return mutation.error;
    return new Error("Failed to mark as delivered");
  }, [mutation.error]);

  return {
    activate: mutation.mutateAsync,
    isActivating: mutation.isPending,
    error,
  };
};
