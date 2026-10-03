import { apiClient, publicClient, unwrap, type ApiResponse } from "@/lib/http";
import type { AdminUser, AuthTokens, LoginRequest, LogoutRequest, RefreshRequest } from "./auth.types";

const BASE = "/auth/admin";

export const authApi = {
  login: (body: LoginRequest) =>
    publicClient.post<ApiResponse<AuthTokens>>(`${BASE}/login`, body).then(unwrap),

  refresh: (body: RefreshRequest) =>
    publicClient.post<ApiResponse<AuthTokens>>(`${BASE}/refresh`, body).then(unwrap),

  logout: (body: LogoutRequest) =>
    publicClient.post<ApiResponse<null>>(`${BASE}/logout`, body).then(unwrap),

  me: () => apiClient.get<ApiResponse<AdminUser>>(`${BASE}/me`).then(unwrap),
};
