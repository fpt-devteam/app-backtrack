import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { getQnAByPostId } from "../api";
import { QnAGetByPostIdRequest } from "../types";

type UseQnAQuestionsProps = {
  postId: string;
  enabled?: boolean;
};

const KEY = ["QnAQuestions"] as const;

export const useQnAQuestions = ({
  postId,
  enabled = true,
}: UseQnAQuestionsProps) => {
  const query = useQuery({
    queryKey: [KEY, postId],
    enabled: !!postId && enabled,
    queryFn: async () => {
      const req: QnAGetByPostIdRequest = {
        postId,
        page: 1,
        pageSize: 20,
      };

      const response = await getQnAByPostId(req);
      if (!response.success || !response.data)
        throw new Error("Post not found");

      return response.data;
    },
  });

  const error = useMemo(() => {
    if (!query.error) return null;
    if (query.error instanceof Error) return query.error;
    return new Error("Fetch item failed");
  }, [query.error]);

  const data = useMemo(() => {
    if (!query.data) return [];
    return query.data.items || [];
  }, [query.data]);

  return {
    data,
    isLoading: query.isLoading,
    error,
  };
};
