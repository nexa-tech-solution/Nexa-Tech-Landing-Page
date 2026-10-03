import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ApiError } from "@/lib/http";
import { queryKeys } from "@/lib/query/query-keys";
import { useAuthStore } from "@/stores/auth-store";
import { authApi } from "./auth.api";
import type { AdminUser, AuthTokens, LoginRequest } from "./auth.types";

export function useMe() {
  const isAuthenticated = useAuthStore((s) => s.tokens !== null);
  const setUser = useAuthStore((s) => s.setUser);

  return useQuery<AdminUser, ApiError>({
    queryKey: queryKeys.auth.me(),
    queryFn: async () => {
      const user = await authApi.me();
      setUser(user);
      return user;
    },
    enabled: isAuthenticated,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation<AuthTokens, ApiError, LoginRequest>({
    mutationFn: authApi.login,
    onSuccess: (tokens) => {
      setSession(tokens);
      queryClient.setQueryData(queryKeys.auth.me(), tokens.user);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const clearSession = useAuthStore((s) => s.clearSession);

  return useMutation<void, ApiError>({
    mutationFn: async () => {
      const refreshToken = useAuthStore.getState().tokens?.refreshToken;
      if (refreshToken) await authApi.logout({ refreshToken });
    },
    // Logout is idempotent server-side: always clear local state, even if the request fails.
    onSettled: () => {
      clearSession();
      queryClient.clear();
    },
  });
}
