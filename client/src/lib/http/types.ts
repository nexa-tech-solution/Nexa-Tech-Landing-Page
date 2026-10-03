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
