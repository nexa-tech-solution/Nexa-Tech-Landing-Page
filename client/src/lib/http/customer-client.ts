import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { env } from "@/config/env";
import { useCustomerAuthStore } from "@/stores/customer-auth-store";
import type { CustomerTokens } from "@/services/customer-auth/customer-auth.types";
import { publicClient } from "./api-client";
import { toApiError } from "./api-error";
import type { ApiResponse } from "./types";

type RetriableConfig = InternalAxiosRequestConfig & { _retried?: boolean };

// Customer endpoints: same refresh-once flow as apiClient, but an expired
// session just signs the customer out instead of redirecting to admin login.
export const customerClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15_000,
  headers: { "Content-Type": "application/json" },
});

customerClient.interceptors.request.use((config) => {
  const token = useCustomerAuthStore.getState().session?.accessToken;
  if (token) config.headers.set("Authorization", `Bearer ${token}`);
  return config;
});

let refreshPromise: Promise<string> | null = null;

async function refresh(): Promise<string> {
  const refreshToken = useCustomerAuthStore.getState().session?.refreshToken;
  if (!refreshToken) throw new Error("No customer session");
  const { data } = await publicClient.post<ApiResponse<CustomerTokens>>("/auth/customer/refresh", { refreshToken });
  useCustomerAuthStore.getState().setSession(data.data);
  return data.data.accessToken;
}

customerClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetriableConfig | undefined;
    if (error.response?.status !== 401 || !config || config._retried) throw toApiError(error);

    config._retried = true;
    try {
      refreshPromise ??= refresh().finally(() => (refreshPromise = null));
      config.headers.set("Authorization", `Bearer ${await refreshPromise}`);
      return customerClient(config);
    } catch (refreshError) {
      useCustomerAuthStore.getState().clearSession();
      throw toApiError(refreshError);
    }
  },
);
