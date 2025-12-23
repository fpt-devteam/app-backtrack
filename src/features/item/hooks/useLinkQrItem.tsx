import { privateClient } from '@/src/api/common/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { ITEMS_QUERY_KEY, LINK_QR_ITEM_MUTATION_KEY } from '../constant/item-query-key.constant';
import { ItemCreateRequest, ItemCreateResponse } from '../types/item.type';

const useLinkQrItem = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: [LINK_QR_ITEM_MUTATION_KEY],
    mutationFn: async (request: ItemCreateRequest) => {
      const response = await privateClient.post("/qr/items", request);
      if (!response) return null;
      return (response.data as ItemCreateResponse).data;
    },

    onSuccess: (data) => {
      if (!data) return;
      console.log("Link Item to QR Code success:", data);
      queryClient.invalidateQueries({
        queryKey: [ITEMS_QUERY_KEY]
      });
    },
  });

  const error = useMemo(() => {
    if (!mutation.error) return null;
    if (mutation.error instanceof Error) return mutation.error;
    return new Error("Link Item failed");
  }, [mutation.error]);

  return {
    linkItemToQr: mutation.mutateAsync,
    loading: mutation.isPending,
    error,
    data: mutation.data,
    resetQuery: mutation.reset,
  };
}

export default useLinkQrItem