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
}

export type ApiResponse<T> = {
  success: boolean;
  data: T | null;
  error: ApiError | null;
  correlationId: string | null;
}

export type LocationFilterValue = {
  lat: number;
  lng: number;
  radius: number;
  label?: string;
  placeId?: string;
};
