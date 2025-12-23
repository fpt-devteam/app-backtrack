import { useInfiniteQuery } from "@tanstack/react-query";
import { ITEMS_QUERY_KEY } from "../constant/item-query-key.constant";
import { fetchItemsAsync } from "../services/item.sevice";
import type { ItemsPage, ItemsPageRequest } from "../types/item.type";

const useItems = (base: Omit<ItemsPageRequest, "page">) => {
  return useInfiniteQuery<ItemsPage>({
    queryKey: [ITEMS_QUERY_KEY],
    initialPageParam: 1,

    queryFn: async ({ pageParam }) => {
      const request = {
        pageSize: base.pageSize,
        page: Number(pageParam)
      } as ItemsPageRequest;

      const result = await fetchItemsAsync(request);
      if (!result) throw new Error("Failed to fetch items");
      return result;
    },

    getNextPageParam: (lastPage) => {
      const loadedCount = lastPage.page * lastPage.pageSize;
      return loadedCount < lastPage.totalCount ? lastPage.page + 1 : undefined;
    },
  });
};

export default useItems;
