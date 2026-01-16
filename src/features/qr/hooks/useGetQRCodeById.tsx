import { useQuery } from '@tanstack/react-query';
import { getQrCodeById } from '@/src/features/qr/api';
import { QR_CODE_DETAIL_QUERY_KEY } from '@/src/features/qr/constants';
import type { GetQrCodeByIdResponse } from '@/src/features/qr/types';

type UseGetQRCodeByIdOptions = {
  enabled?: boolean;
};

export const useGetQRCodeById = (id: string, { enabled = true }: UseGetQRCodeByIdOptions = {}) => {
  const query = useQuery<GetQrCodeByIdResponse>({
    queryKey: [...QR_CODE_DETAIL_QUERY_KEY, id],
    queryFn: () => getQrCodeById(id),
    enabled: enabled && !!id,
  });

  return {
    qrCode: query.data?.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    isSuccess: query.isSuccess,
    isError: query.isError,
  };
};


