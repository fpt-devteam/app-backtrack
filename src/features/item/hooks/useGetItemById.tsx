import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { fetchItemByIdAsync } from '../services/item.sevice';
import { ItemGetByIdRequest } from '../types/item.type';

const useGetItemById = (request: ItemGetByIdRequest) => {
  const query = useQuery({
    queryKey: ["items", "detail", request.itemId],
    queryFn: async () => {
      const response = await fetchItemByIdAsync(request);
      if (!response) throw new Error("Item not found");
      return response;
    },
    enabled: !!request.itemId,
    retry: false,
  });

  const error = useMemo(() => {
    if (!query.error) return null;
    if (query.error instanceof Error) return query.error;
    return new Error("Fetch item failed");
  }, [query.error]);

  return {
    item: query.data,
    loading: query.isLoading,
    error,
    refetch: query.refetch,
    isRefetching: query.isRefetching,
  };
};

export default useGetItemById;