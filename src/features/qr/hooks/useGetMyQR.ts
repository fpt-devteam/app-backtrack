import { getMyQRCode } from "@/src/features/qr/api";
import { QR_CODES_ME_QUERY_KEY } from "@/src/features/qr/constants";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useGetMyQR = () => {
  const query = useQuery({
    queryKey: [...QR_CODES_ME_QUERY_KEY],
    queryFn: async () => {
      const response = await getMyQRCode();
      if (!response.success) throw new Error("Failed to fetch QR code");
      return response.data;
    },
  });

  const error = useMemo(() => {
    if (!query.error) return null;
    if (query.error instanceof Error) return query.error;
    return new Error("Fetch QR code failed");
  }, [query.error]);

  return {
    data: query.data,
    isLoading: query.isLoading,
    error,
    refetch: query.refetch,
  };
};
