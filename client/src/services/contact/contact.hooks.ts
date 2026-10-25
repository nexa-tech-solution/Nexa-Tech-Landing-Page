import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { ApiError } from "@/lib/http";
import { queryKeys } from "@/lib/query/query-keys";
import { contactApi } from "./contact.api";
import type {
  ContactInboxFetchResult,
  ContactListParams,
  ContactReplyInput,
  ContactStatus,
  ContactSubmitInput,
} from "./contact.types";

export function useSubmitContact() {
  return useMutation<null, ApiError, ContactSubmitInput>({
    mutationFn: contactApi.submit,
  });
}

export function useContactMessages(params: ContactListParams) {
  return useQuery({
    queryKey: queryKeys.contact.list(params),
    queryFn: () => contactApi.list(params),
    placeholderData: keepPreviousData,
    refetchInterval: 60_000, // new messages arrive while the inbox is open
  });
}

export function useContactUnreadCount(enabled = true) {
  return useQuery({
    queryKey: queryKeys.contact.unread(),
    queryFn: contactApi.unreadCount,
    enabled,
    refetchInterval: 60_000,
  });
}

export function useContactMessage(id: number | null) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: queryKeys.contact.detail(id ?? 0),
    queryFn: async () => {
      const detail = await contactApi.get(id!);
      // Opening marks it read: refresh the list and the badge.
      queryClient.invalidateQueries({ queryKey: queryKeys.contact.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.contact.unread() });
      return detail;
    },
    enabled: id !== null,
  });
}

function useInvalidateContact() {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.contact.all });
}

export function useReplyContact() {
  const invalidate = useInvalidateContact();
  return useMutation<
    unknown,
    ApiError,
    { id: number; input: ContactReplyInput }
  >({
    mutationFn: ({ id, input }) => contactApi.reply(id, input),
    // A failed send is still recorded on the server, so refresh either way.
    onSettled: invalidate,
  });
}

export function useSetContactStatus() {
  const invalidate = useInvalidateContact();
  return useMutation<unknown, ApiError, { id: number; status: ContactStatus }>({
    mutationFn: ({ id, status }) => contactApi.setStatus(id, status),
    onSuccess: invalidate,
  });
}

export function useDeleteContact() {
  const invalidate = useInvalidateContact();
  return useMutation<unknown, ApiError, number>({
    mutationFn: contactApi.remove,
    onSuccess: invalidate,
  });
}

// Imports new emails from the contact mailbox, then reloads the list if any arrived.
export function useFetchContactInbox() {
  const queryClient = useQueryClient();
  return useMutation<ContactInboxFetchResult, ApiError, boolean>({
    mutationFn: (force) => contactApi.fetchInbox(force),
    onSuccess: (result) => {
      if (result.imported > 0) {
        queryClient.invalidateQueries({ queryKey: queryKeys.contact.lists() });
        queryClient.invalidateQueries({ queryKey: queryKeys.contact.unread() });
      }
    },
  });
}

export function useContactTemplates() {
  return useQuery({
    queryKey: queryKeys.contact.templates(),
    queryFn: contactApi.templates,
    staleTime: Infinity, // built into the server
  });
}

// Pass null to pause (e.g. while the preview tab is hidden or the body is empty).
export function useContactPreview(id: number, input: ContactReplyInput | null) {
  return useQuery({
    queryKey: queryKeys.contact.preview(id, input ?? { subject: "", body: "" }),
    queryFn: () => contactApi.preview(id, input!),
    enabled: input !== null,
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });
}
