import { privateClient } from "@/src/api/common/client";
import { REPORT_CREATE_API } from "../constants/report.constant";
import { ReportCreateRequest, ReportCreateResponse } from "../types/report.type";

export const createReport = async (req: ReportCreateRequest) => {
  const response = await privateClient.post(REPORT_CREATE_API, req, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const result = response.data as ReportCreateResponse;
  if (!result.success) return null;
  return result;
};