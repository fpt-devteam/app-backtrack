
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { REPORT_CREATE_KEY } from '../constants/report-query.key';
import { createReport } from '../services/report.service';
import { ReportCreateRequest } from '../types/report.type';

const useCreateReport = () => {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationKey: REPORT_CREATE_KEY,
    mutationFn: async (request: ReportCreateRequest) => {
      const response = await createReport(request);
      if (!response) return null;
      return response.data;
    },

    onSuccess: async () => {
      // Invalidate fetch queries or update cache here if needed    
      // qc.invalidateQueries({ queryKey: REPORT_CREATE_KEY });
    },
  });

  const error = useMemo(() => {
    if (!mutation.error) return null;
    if (mutation.error instanceof Error) return mutation.error;
    return new Error("Create report failed");
  }, [mutation.error]);

  return {
    createReport: mutation.mutateAsync,
    isCreatingReport: mutation.isPending,
    error,
  }
}

export default useCreateReport