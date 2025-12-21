export type Nullable<T> = T | null;

export type Partial<T> = {
  [P in keyof T]?: T[P];
};

export type Required<T> = {
  [P in keyof T]-?: T[P];
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
  correlationId: string;
}