export type PaginateQuery<T> = {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
};

export type PagedResponse<T> = {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
}

export type ApiError = {
  code: string;
  message: string;
  statusCode: number;
  details?: any;
}

export type ApiResponse<T> = {
  success: boolean;
  data: T | null;
  error: ApiError | null;
  correlationId: string | null;
}