import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ApiError } from "@/lib/http";
import { queryKeys } from "@/lib/query/query-keys";
import { useCustomerAuthStore } from "@/stores/customer-auth-store";
import { customerAuthApi } from "./customer-auth.api";
import type { CustomerTokens, EmailSignUpRequest, ResetPasswordRequest } from "./customer-auth.types";

// Shared by every sign-in method: store the session, then refetch per-customer data.
function useSessionLogin<TIn>(fn: (input: TIn) => Promise<CustomerTokens>) {
  const queryClient = useQueryClient();
  return useMutation<CustomerTokens, ApiError, TIn>({
    mutationFn: fn,
    onSuccess: (tokens) => {
      useCustomerAuthStore.getState().setSession(tokens);
      // "Did I vote?" flags are per customer.
      void queryClient.invalidateQueries({ queryKey: queryKeys.rankings.all });
    },
  });
}

export const useGoogleLogin = () => useSessionLogin((idToken: string) => customerAuthApi.google({ idToken }));
export const useAppleLogin = () => useSessionLogin(customerAuthApi.apple);
export const useEmailSignIn = () => useSessionLogin(customerAuthApi.emailSignIn);

export const useEmailSignUp = () => useMutation<void, ApiError, EmailSignUpRequest>({ mutationFn: customerAuthApi.emailSignUp });
export const useResendVerification = () => useMutation<void, ApiError, string>({ mutationFn: customerAuthApi.resendVerification });
export const useForgotPassword = () => useMutation<void, ApiError, string>({ mutationFn: customerAuthApi.forgotPassword });
export const useResetPassword = () => useMutation<void, ApiError, ResetPasswordRequest>({ mutationFn: customerAuthApi.resetPassword });

export function useCustomerLogout() {
  const queryClient = useQueryClient();
  return () => {
    const { session, clearSession } = useCustomerAuthStore.getState();
    if (session) void customerAuthApi.logout(session.refreshToken).catch(() => {});
    clearSession();
    window.google?.accounts.id.disableAutoSelect();
    void queryClient.invalidateQueries({ queryKey: queryKeys.rankings.all });
  };
}
