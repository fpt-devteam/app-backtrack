export type PagedRequest = {
  page: number;
  pageSize: number;
}

export const DEFAULT_PAGED_REQUEST: PagedRequest = {
  page: 1,
  pageSize: 20,
}

export type PagedResponse<T> = {
  items: T[];
  total: number;
}

export type ApiError = {
  code: string;
  message: string;
  statusCode: number;
  details?: unknown;
}

export type ApiResponse<T> = {
  success: boolean;
  data: T | null;
  error?: ApiError | null;
  correlationId?: string | null;
}

export type CursorPaginationParams = {
  cursor?: string,
  limit?: number,
};

export type CursorScrollResponse<T> = {
  items: T[];
  nextCursor: string | null;
  hasMore: boolean;
}
