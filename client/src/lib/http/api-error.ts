import { isAxiosError } from "axios";
import type { ApiResponse } from "./types";

export const API_ERROR_CODES = {
  VALIDATION: "COMMON-400",
  UNAUTHORIZED: "AUTH-401",
  INVALID_CREDENTIALS: "AUTH-401-01",
  REFRESH_TOKEN_INVALID: "AUTH-401-02",
  FORBIDDEN: "AUTH-403",
  FORBIDDEN_ROLE: "AUTH-403-01",
  EXPENSE_NOT_FOUND: "EXPENSE-404",
  BLOG_POST_NOT_FOUND: "BLOG-404",
  APP_NOT_FOUND: "APP-404",
  MAKER_NOT_FOUND: "MAKER-404",
  STORE_URL_INVALID: "APP-400-01",
  INVITE_NOT_FOUND: "INVITE-404",
  INVITE_DUPLICATE: "INVITE-409",
  STORE_LOOKUP_FAILED: "APP-404-01",
  INTEGRATION_NOT_FOUND: "INTEGRATION-404",
  INTEGRATION_DUPLICATE: "INTEGRATION-409-01",
  INTEGRATION_NAME_DUPLICATE: "INTEGRATION-409-02",
  INTEGRATION_SYNC_CONFLICT: "INTEGRATION-409",
  CONTACT_RATE_LIMITED: "CONTACT-429",
  CONTACT_REPLY_TO_SELF: "CONTACT-422",
  MAIL_NOT_CONFIGURED: "MAIL-503",
  MAIL_SEND_FAILED: "MAIL-502",
  MAIL_INBOX_NOT_CONFIGURED: "MAIL-INBOX-503",
  MAIL_INBOX_FAILED: "MAIL-INBOX-502",
  NETWORK: "NETWORK",
  UNKNOWN: "UNKNOWN",
} as const;

export type ApiErrorCode = (typeof API_ERROR_CODES)[keyof typeof API_ERROR_CODES] | (string & {});

export class ApiError extends Error {
  readonly status: number;
  readonly errorCode: ApiErrorCode;
  readonly messageCode?: string;

  constructor(params: { message: string; status: number; errorCode: ApiErrorCode; messageCode?: string }) {
    super(params.message);
    this.name = "ApiError";
    this.status = params.status;
    this.errorCode = params.errorCode;
    this.messageCode = params.messageCode;
  }

  get isUnauthorized() {
    return this.status === 401;
  }

  get isForbidden() {
    return this.status === 403;
  }
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (isAxiosError<Partial<ApiResponse<unknown>>>(error)) {
    if (!error.response) {
      return new ApiError({ message: error.message, status: 0, errorCode: API_ERROR_CODES.NETWORK });
    }
    const body = error.response.data ?? {};
    return new ApiError({
      message: body.message ?? error.message,
      status: error.response.status,
      errorCode: body.errorCode ?? API_ERROR_CODES.UNKNOWN,
      messageCode: body.messageCode,
    });
  }

  return new ApiError({
    message: error instanceof Error ? error.message : "Unknown error",
    status: 0,
    errorCode: API_ERROR_CODES.UNKNOWN,
  });
}
