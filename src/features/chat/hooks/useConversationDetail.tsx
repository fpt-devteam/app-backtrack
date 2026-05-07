import { getConversationDetailApi } from "@/src/features/chat/api";
import { CHAT_QUERY_KEY } from "@/src/features/chat/constants";
import type { Conversation, ConversationsGetResponse } from "@/src/features/chat/types";
import { useMemo } from "react";
import { useQuery, useQueryClient, type InfiniteData } from "@tanstack/react-query";

const normalizeConversation = (
  conversation: Conversation | null | undefined,
): Conversation | null => {
  if (!conversation) return null;

  return {
    ...conversation,
    partner: conversation.partner ?? null,
    orgId: conversation.orgId ?? null,
    orgName: conversation.orgName ?? null,
    orgLogoUrl: conversation.orgLogoUrl ?? null,
    status: conversation.status ?? null,
    assignedStaffId: conversation.assignedStaffId ?? null,
  };
};

const mergeConversationPartner = (
  detailPartner: Conversation["partner"],
  cachedPartner: Conversation["partner"],
): Conversation["partner"] => {
  if (!detailPartner) return cachedPartner ?? null;
  if (!cachedPartner) return detailPartner;

  return {
    ...cachedPartner,
    ...detailPartner,
    id: detailPartner.id || cachedPartner.id,
    displayName: detailPartner.displayName ?? cachedPartner.displayName,
    email: detailPartner.email ?? cachedPartner.email,
    avatarUrl: detailPartner.avatarUrl ?? cachedPartner.avatarUrl,
  };
};

const mergeConversation = (
  detailConversation: Conversation | null | undefined,
  cachedConversation: Conversation | null,
): Conversation | null => {
  const normalizedDetail = normalizeConversation(detailConversation);
  const normalizedCached = normalizeConversation(cachedConversation);

  if (!normalizedDetail) return normalizedCached;
  if (!normalizedCached) return normalizedDetail;

  return {
    ...normalizedCached,
    ...normalizedDetail,
    partner: mergeConversationPartner(
      normalizedDetail.partner,
      normalizedCached.partner,
    ),
    orgId:
      detailConversation?.orgId !== undefined
        ? normalizedDetail.orgId
        : normalizedCached.orgId,
    orgName: normalizedDetail.orgName ?? normalizedCached.orgName,
    orgLogoUrl: normalizedDetail.orgLogoUrl ?? normalizedCached.orgLogoUrl,
    status:
      detailConversation?.status !== undefined
        ? normalizedDetail.status
        : normalizedCached.status,
    assignedStaffId:
      detailConversation?.assignedStaffId !== undefined
        ? normalizedDetail.assignedStaffId
        : normalizedCached.assignedStaffId,
  };
};

export const useConversationDetail = (conversationId: string) => {
  const queryClient = useQueryClient();

  const cachedConversation = useMemo(() => {
    const cachedPages = queryClient.getQueryData<
      InfiniteData<ConversationsGetResponse["data"]>
    >(CHAT_QUERY_KEY.conversations);

    return (
      cachedPages?.pages
        .flatMap((page) => page?.conversations ?? [])
        .find((conversation) => conversation.conversationId === conversationId) ??
      null
    );
  }, [conversationId, queryClient]);

  const query = useQuery({
    queryKey: CHAT_QUERY_KEY.conversationDetail(conversationId),
    queryFn: async () => {
      const response = await getConversationDetailApi(conversationId);
      if (!response?.success)
        throw new Error("Failed to fetch conversation detail");
      return response.data?.conversation ?? null;
    },
    enabled: !!conversationId,
  });

  const data = useMemo(
    () => mergeConversation(query.data, cachedConversation),
    [cachedConversation, query.data],
  );

  return {
    data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
