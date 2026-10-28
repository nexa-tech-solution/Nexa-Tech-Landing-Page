import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ApiError } from "@/lib/http";
import { queryKeys } from "@/lib/query/query-keys";
import { useCustomerAuthStore } from "@/stores/customer-auth-store";
import { accountApi } from "./account.api";
import type { AppNotification, InviteInput, InvitePreview, InviteResult, NotificationSettings, Workspace } from "./account.types";

// Account data is per customer; key it by id so switching accounts refetches.
const useCustomerId = () => useCustomerAuthStore((s) => s.customer?.customerId);

export function useWorkspace() {
  const id = useCustomerId();
  return useQuery<Workspace, ApiError>({
    queryKey: queryKeys.account.workspace(id ?? 0),
    queryFn: accountApi.workspace,
    enabled: id !== undefined,
  });
}

function useWorkspaceMutation<TIn, TOut>(fn: (input: TIn) => Promise<TOut>) {
  const queryClient = useQueryClient();
  return useMutation<TOut, ApiError, TIn>({
    mutationFn: fn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.account.all }),
  });
}

export const useRenameWorkspace = () => useWorkspaceMutation<string, Workspace>(accountApi.renameWorkspace);
export const useInviteMember = () => useWorkspaceMutation<InviteInput, InviteResult>(accountApi.invite);
export const useRemoveMember = () => useWorkspaceMutation<number, void>(accountApi.removeMember);

export function useAcceptInvite() {
  const queryClient = useQueryClient();
  return useMutation<Workspace, ApiError, string>({
    mutationFn: accountApi.acceptInvite,
    // The new workspace brings its maker profile and apps.
    onSuccess: () => queryClient.invalidateQueries(),
  });
}

export function useInvitePreview(token: string | undefined) {
  return useQuery<InvitePreview, ApiError>({
    queryKey: queryKeys.account.invite(token ?? ""),
    queryFn: () => accountApi.invitePreview(token!),
    enabled: Boolean(token),
    retry: false,
  });
}

// Polled so the bell picks up new votes and comments without a reload.
export function useNotifications() {
  const id = useCustomerId();
  return useQuery<AppNotification[], ApiError>({
    queryKey: queryKeys.account.notifications(id ?? 0),
    queryFn: accountApi.notifications,
    enabled: id !== undefined,
    refetchInterval: 60_000,
  });
}

export function useMarkRead() {
  const queryClient = useQueryClient();
  const id = useCustomerId();
  return useMutation<void, ApiError, number[] | undefined>({
    mutationFn: accountApi.markRead,
    onMutate: (ids) =>
      queryClient.setQueryData<AppNotification[]>(queryKeys.account.notifications(id ?? 0), (list) =>
        list?.map((n) => (!ids || ids.includes(n.id) ? { ...n, read: true } : n)),
      ),
  });
}

export function useNotificationSettings() {
  const id = useCustomerId();
  return useQuery<NotificationSettings, ApiError>({
    queryKey: queryKeys.account.settings(id ?? 0),
    queryFn: accountApi.settings,
    enabled: id !== undefined,
  });
}

export function useSaveNotificationSettings() {
  const queryClient = useQueryClient();
  const id = useCustomerId();
  return useMutation<NotificationSettings, ApiError, NotificationSettings>({
    mutationFn: accountApi.saveSettings,
    onSuccess: (settings) => queryClient.setQueryData(queryKeys.account.settings(id ?? 0), settings),
  });
}
