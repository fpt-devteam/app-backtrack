import { getAllMyPost } from "@/src/features/post/api";
import { MY_POSTS_QUERY_KEY } from "@/src/features/post/constants";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useGetAllMyPost = () => {
  const query = useQuery({
    queryKey: MY_POSTS_QUERY_KEY,
    queryFn: async () => {
      const response = await getAllMyPost();
      if (!response.success) throw new Error("Failed to fetch your posts");
      return response.data;
    },
  });

  const error = useMemo(() => {
    if (!query.error) return null;
    if (query.error instanceof Error) return query.error;
    return new Error("Fetch my posts failed");
  }, [query.error]);

  return {
    data: query.data,
    isLoading: query.isLoading,
    error,
    refetch: query.refetch,
  };
};