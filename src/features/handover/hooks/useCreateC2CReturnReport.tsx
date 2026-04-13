import { createC2CReturnReportApi } from "@/src/features/handover/api";
import {
  C2C_RETURN_REPORTS_QUERY_KEY,
  CREATE_C2C_RETURN_REPORT_KEY,
} from "@/src/features/handover/constants";
import type { CreateC2CReturnReportRequest } from "@/src/features/handover/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

export const useCreateC2CReturnReport = () => {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationKey: CREATE_C2C_RETURN_REPORT_KEY,
    mutationFn: async (request: CreateC2CReturnReportRequest) => {
      const response = await createC2CReturnReportApi(request);
      if (!response.success) throw new Error("Failed to create return report");
      return response.data;
    },
    onSuccess: async () => {
      qc.invalidateQueries({ queryKey: C2C_RETURN_REPORTS_QUERY_KEY });
    },
  });

  const error = useMemo(() => {
    if (!mutation.error) return null;
    if (mutation.error instanceof Error) return mutation.error;
    return new Error("Failed to create return report");
  }, [mutation.error]);

  return {
    createC2CReturnReport: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error,
  };
};
