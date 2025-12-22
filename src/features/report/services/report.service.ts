import { privateClient } from "@/src/api/common/client";
import { CreateReportRequest, CreateReportResponse } from "../types/report.type";

export const createReport = async (req: CreateReportRequest): Promise<CreateReportResponse> => {
  const response = await privateClient.post('core/posts', req, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const res = response.data as CreateReportResponse;
  return res;
};  