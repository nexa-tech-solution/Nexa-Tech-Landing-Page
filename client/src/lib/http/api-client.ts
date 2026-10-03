import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import { env, LOGIN_PATH } from "@/config/env";
import { useAuthStore } from "@/stores/auth-store";
import type { AuthTokens } from "@/services/auth/auth.types";
import { API_ERROR_CODES, toApiError } from "./api-error";
import type { ApiResponse, Paginated, PaginatedResponse } from "./types";

type RetriableConfig = InternalAxiosRequestConfig & { _retried?: boolean };

const baseConfig = {
  baseURL: env.apiBaseUrl,
  timeout: 15_000,
  headers: { "Content-Type": "application/json" },
};

// Bare instance for public auth calls: no auth header, no refresh loop.
export const publicClient = axios.create(baseConfig);

// Instance for protected endpoints: attaches the access token and refreshes once on 401.
export const apiClient = axios.create(baseConfig);

publicClient.interceptors.response.use(undefined, (error) => {
  throw toApiError(error);
});

const AUTH_PUBLIC_PATHS = ["/auth/admin/login", "/auth/admin/refresh", "/auth/admin/logout"];

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().tokens?.accessToken;
  if (token) config.headers.set("Authorization", `Bearer ${token}`);
  return config;
});

// Single-flight: concurrent 401s share one refresh request (refresh tokens rotate).
let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refreshToken = useAuthStore.getState().tokens?.refreshToken;
  if (!refreshToken) throw new Error("No active session");

  const { data } = await publicClient.post<ApiResponse<AuthTokens>>("/auth/admin/refresh", { refreshToken });
  useAuthStore.getState().setSession(data.data);
  return data.data.accessToken;
}

function expireSession() {
  useAuthStore.getState().clearSession();
  if (window.location.pathname !== LOGIN_PATH) window.location.assign(LOGIN_PATH);
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetriableConfig | undefined;
    const isAuthPath = AUTH_PUBLIC_PATHS.some((p) => config?.url?.startsWith(p));

    if (error.response?.status !== 401 || !config || config._retried || isAuthPath) {
      throw toApiError(error);
    }

    config._retried = true;
    try {
      refreshPromise ??= refreshAccessToken().finally(() => (refreshPromise = null));
      const token = await refreshPromise;
      config.headers.set("Authorization", `Bearer ${token}`);
      return apiClient(config);
    } catch (refreshError) {
      const apiError = toApiError(refreshError);
      if (apiError.status === 401 || apiError.errorCode === API_ERROR_CODES.REFRESH_TOKEN_INVALID || !useAuthStore.getState().tokens) {
        expireSession();
      }
      throw apiError;
    }
  },
);

// Strip the envelope so API functions return the payload directly.
export const unwrap = <T>(response: AxiosResponse<ApiResponse<T>>): T => response.data.data;

export const unwrapPage = <T>({ data }: AxiosResponse<PaginatedResponse<T>>): Paginated<T> => ({
  items: data.data,
  page: data.page,
  size: data.size,
  totalItems: data.totalItems,
  totalPages: data.totalPages,
  hasNext: data.hasNext,
  hasPrevious: data.hasPrevious,
});
