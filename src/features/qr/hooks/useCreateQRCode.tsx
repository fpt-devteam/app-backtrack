import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createQrCode } from '@/src/features/qr/api';
import { QR_CODES_QUERY_KEY } from '@/src/features/qr/constants';
import type { CreateQrCodeRequest, CreateQrCodeResponse } from '@/src/features/qr/types';

type UseCreateQRCodeOptions = {
  onSuccess?: (data: CreateQrCodeResponse) => void;
  onError?: (error: Error) => void;
};

export const useCreateQRCode = ({ onSuccess, onError }: UseCreateQRCodeOptions = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<CreateQrCodeResponse, Error, CreateQrCodeRequest>({
    mutationFn: createQrCode,
    onSuccess: (data) => {
      // Invalidate QR codes list to refetch
      queryClient.invalidateQueries({ queryKey: QR_CODES_QUERY_KEY });
      onSuccess?.(data);
    },
    onError: (error) => {
      console.error('Failed to create QR code:', error);
      onError?.(error);
    },
  });

  return {
    createQRCode: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
};


