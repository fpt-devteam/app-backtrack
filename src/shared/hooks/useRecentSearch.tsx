import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type RecentSearchItem = {
  value: string;
  updatedAt: number;
};

type UseRecentSearchParams = {
  namespace: string;
  maxItems?: number;
};

type MutationContext = {
  previous?: RecentSearchItem[];
};

const DEFAULT_MAX_ITEMS = 10;
const RECENT_SEARCH_QUERY_KEY = ["recent-search"] as const;

const recentSearchQueryKey = (namespace: string) =>
  [...RECENT_SEARCH_QUERY_KEY, namespace] as const;

const recentSearchMutationKey = (
  namespace: string,
  action: "add" | "remove" | "clear",
) => [...RECENT_SEARCH_QUERY_KEY, namespace, action] as const;

function normalize(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  const collapsed = trimmed.replace(/\s+/g, " ");
  return typeof collapsed.normalize === "function"
    ? collapsed.normalize("NFC")
    : collapsed;
}

function compareKey(value: string): string {
  return value.toLocaleLowerCase();
}

function isRecentSearchItem(value: unknown): value is RecentSearchItem {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.value === "string" && typeof record.updatedAt === "number"
  );
}

function sortByUpdatedAtDesc(
  items: readonly RecentSearchItem[],
): RecentSearchItem[] {
  return [...items].sort((a, b) => b.updatedAt - a.updatedAt);
}

async function loadRecentSearches(
  storageKey: string,
  maxItems: number,
): Promise<RecentSearchItem[]> {
  try {
    const raw = await AsyncStorage.getItem(storageKey);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const sanitized = parsed.filter(isRecentSearchItem);
    const sorted = sortByUpdatedAtDesc(sanitized);
    return sorted.slice(0, maxItems);
  } catch (error) {
    console.error("Failed to load recent searches:", error);
    return [];
  }
}

async function saveRecentSearches(
  storageKey: string,
  items: readonly RecentSearchItem[],
): Promise<void> {
  await AsyncStorage.setItem(storageKey, JSON.stringify(items));
}

function buildAddedList(
  current: readonly RecentSearchItem[],
  value: string,
  maxItems: number,
): RecentSearchItem[] {
  if (!value) return sortByUpdatedAtDesc(current).slice(0, maxItems);
  const key = compareKey(value);
  const filtered = current.filter((item) => compareKey(item.value) !== key);
  const next = [{ value, updatedAt: Date.now() }, ...filtered];
  const sorted = sortByUpdatedAtDesc(next);
  return sorted.slice(0, maxItems);
}

function buildRemovedList(
  current: readonly RecentSearchItem[],
  value: string,
  maxItems: number,
): RecentSearchItem[] {
  if (!value) return sortByUpdatedAtDesc(current).slice(0, maxItems);
  const key = compareKey(value);
  const filtered = current.filter((item) => compareKey(item.value) !== key);
  return sortByUpdatedAtDesc(filtered).slice(0, maxItems);
}

export function useRecentSearch({
  namespace,
  maxItems = DEFAULT_MAX_ITEMS,
}: UseRecentSearchParams) {
  const queryClient = useQueryClient();
  const storageKey = `recent_search:${namespace}`;
  const queryKey = recentSearchQueryKey(namespace);

  const query = useQuery<RecentSearchItem[], Error>({
    queryKey,
    queryFn: () => loadRecentSearches(storageKey, maxItems),
  });

  const addMutation = useMutation<
    RecentSearchItem[],
    Error,
    string,
    MutationContext
  >({
    mutationKey: recentSearchMutationKey(namespace, "add"),
    onMutate: (valueRaw) => {
      const previous = queryClient.getQueryData<RecentSearchItem[]>(queryKey);
      const normalized = normalize(valueRaw);
      if (!normalized) return { previous };

      queryClient.setQueryData<RecentSearchItem[]>(queryKey, (current) =>
        buildAddedList(current ?? [], normalized, maxItems),
      );
      return { previous };
    },
    mutationFn: async (valueRaw) => {
      const normalized = normalize(valueRaw);
      if (!normalized) {
        return (
          queryClient.getQueryData<RecentSearchItem[]>(queryKey) ??
          (await loadRecentSearches(storageKey, maxItems))
        );
      }

      const current = await loadRecentSearches(storageKey, maxItems);
      const next = buildAddedList(current, normalized, maxItems);
      await saveRecentSearches(storageKey, next);
      return next;
    },
    onError: (_error, _value, context) => {
      queryClient.setQueryData<RecentSearchItem[] | undefined>(
        queryKey,
        context?.previous,
      );
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKey, data);
    },
  });

  const removeMutation = useMutation<
    RecentSearchItem[],
    Error,
    string,
    MutationContext
  >({
    mutationKey: recentSearchMutationKey(namespace, "remove"),
    onMutate: (valueRaw) => {
      const previous = queryClient.getQueryData<RecentSearchItem[]>(queryKey);
      const normalized = normalize(valueRaw);
      if (!normalized) return { previous };

      queryClient.setQueryData<RecentSearchItem[]>(queryKey, (current) =>
        buildRemovedList(current ?? [], normalized, maxItems),
      );
      return { previous };
    },
    mutationFn: async (valueRaw) => {
      const normalized = normalize(valueRaw);
      if (!normalized) {
        return (
          queryClient.getQueryData<RecentSearchItem[]>(queryKey) ??
          (await loadRecentSearches(storageKey, maxItems))
        );
      }

      const current = await loadRecentSearches(storageKey, maxItems);
      const next = buildRemovedList(current, normalized, maxItems);
      await saveRecentSearches(storageKey, next);
      return next;
    },
    onError: (_error, _value, context) => {
      queryClient.setQueryData<RecentSearchItem[] | undefined>(
        queryKey,
        context?.previous,
      );
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKey, data);
    },
  });

  const clearMutation = useMutation<
    RecentSearchItem[],
    Error,
    void,
    MutationContext
  >({
    mutationKey: recentSearchMutationKey(namespace, "clear"),
    onMutate: () => {
      const previous = queryClient.getQueryData<RecentSearchItem[]>(queryKey);
      queryClient.setQueryData(queryKey, []);
      return { previous };
    },
    mutationFn: async () => {
      await saveRecentSearches(storageKey, []);
      return [];
    },
    onError: (_error, _value, context) => {
      queryClient.setQueryData<RecentSearchItem[] | undefined>(
        queryKey,
        context?.previous,
      );
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKey, data);
    },
  });

  return {
    items: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    add: addMutation.mutateAsync,
    isAdding: addMutation.isPending,
    addError: addMutation.error,
    remove: removeMutation.mutateAsync,
    isRemoving: removeMutation.isPending,
    removeError: removeMutation.error,
    clear: clearMutation.mutateAsync,
    isClearing: clearMutation.isPending,
    clearError: clearMutation.error,
  };
}
