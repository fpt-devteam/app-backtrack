import { useState } from 'react';
import { createReport } from '../services/report.service';
import { CreateReportRequest, CreateReportResponse } from '../types/report.type';

const useCreateReport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createNewReport = async (reportData: CreateReportRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response: CreateReportResponse = await createReport(reportData);
      return response.data;
    } catch (err: any) {
      console.error("Create report error:", err);
      setError("Failed to create report! Please try again.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createNewReport, loading, error };
}

export default useCreateReport