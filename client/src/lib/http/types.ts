// Envelope returned by every backend endpoint.
export type ApiResponse<T> = {
  success: boolean;
  code: number;
  errorCode?: string;
  messageCode: string;
  message?: string;
  data: T;
  timestamp?: number;
};

// List endpoints return the items in `data` and pagination fields beside it.
export type PageMeta = {
  page: number; // 1-based
  size: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

export type PaginatedResponse<T> = ApiResponse<T[]> & PageMeta;

export type Paginated<T> = PageMeta & { items: T[] };

export type SortDirection = "ASC" | "DESC";
