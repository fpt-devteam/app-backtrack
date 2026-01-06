import { privateClient } from '@/src/api/common/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import {
  ITEMS_QUERY_KEY,
  LINK_QR_ITEM_MUTATION_KEY
} from '../constant/item-query-key.constant';
import { ItemCreateRequest } from '../types/item.type';

export type LinkQrItemResponse = {
  qrCode: {
    id: string;
    publicCode: string;
    linkedAt?: string;
    createdAt?: string;
  };
  item: {
    name: string;
    description: string;
    imageUrls: string[];
  };
  ownerId: string;
};

const useLinkQrItem = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    LinkQrItemResponse,
    Error,
    ItemCreateRequest
  >({
    mutationKey: [LINK_QR_ITEM_MUTATION_KEY],

    mutationFn: async (request: ItemCreateRequest) => {
      const response = await privateClient.post('/qr/qr-codes', {
        item: request,
      });

      return response.data.data as LinkQrItemResponse;
    },

    onSuccess: (data) => {
      console.log('Link Item to QR Code success:', data);
      queryClient.invalidateQueries({
        queryKey: [ITEMS_QUERY_KEY],
      });
    },
  });

  const error = useMemo(() => {
    if (!mutation.error) return null;
    return mutation.error instanceof Error
      ? mutation.error
      : new Error('Link Item failed');
  }, [mutation.error]);

  return {
    linkItemToQr: mutation.mutateAsync,
    loading: mutation.isPending,
    error,
    data: mutation.data,
    resetQuery: mutation.reset,
  };
};

export default useLinkQrItem;
