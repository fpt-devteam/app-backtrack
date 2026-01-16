import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateQrCode } from '@/src/features/qr/api';
import { QR_CODES_QUERY_KEY, QR_CODE_DETAIL_QUERY_KEY } from '@/src/features/qr/constants';
import type { UpdateQrCodeRequest, UpdateQrCodeResponse } from '@/src/features/qr/types';

type UpdateQrCodeVariables = {
  id: string;
  data: UpdateQrCodeRequest;
};

type UseUpdateQRCodeOptions = {
  onSuccess?: (data: UpdateQrCodeResponse) => void;
  onError?: (error: Error) => void;
};

export const useUpdateQRCode = ({ onSuccess, onError }: UseUpdateQRCodeOptions = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<UpdateQrCodeResponse, Error, UpdateQrCodeVariables>({
    mutationFn: ({ id, data }) => updateQrCode(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: QR_CODES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...QR_CODE_DETAIL_QUERY_KEY, variables.id] });
      onSuccess?.(data);
    },
    onError: (error) => {
      onError?.(error);
    },
  });

  return {
    updateQRCode: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
};


