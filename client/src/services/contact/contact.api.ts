import {
  apiClient,
  publicClient,
  unwrap,
  unwrapPage,
  type ApiResponse,
  type PaginatedResponse,
} from "@/lib/http";
import type {
  ContactEmailPreview,
  ContactEmailTemplate,
  ContactInboxFetchResult,
  ContactListParams,
  ContactMessage,
  ContactMessageDetail,
  ContactReplyInput,
  ContactStatus,
  ContactSubmitInput,
} from "./contact.types";

const ADMIN = "/admin/contact-messages";

export const contactApi = {
  // Public landing-page form; rate-limited per IP on the server.
  submit: (input: ContactSubmitInput) =>
    publicClient.post<ApiResponse<null>>("/contact", input).then(unwrap),

  list: (params: ContactListParams) =>
    apiClient
      .get<PaginatedResponse<ContactMessage>>(ADMIN, {
        params: {
          page: 1,
          size: 50,
          sortBy: "createdAt",
          sortDirection: "DESC",
          ...params,
        },
      })
      .then(unwrapPage),

  unreadCount: () =>
    apiClient.get<ApiResponse<number>>(`${ADMIN}/unread-count`).then(unwrap),

  // Opening a NEW message marks it READ on the server.
  get: (id: number) =>
    apiClient
      .get<ApiResponse<ContactMessageDetail>>(`${ADMIN}/${id}`)
      .then(unwrap),

  // Emails the sender (original quoted below) and records the reply; 502/503 when mail fails.
  reply: (id: number, input: ContactReplyInput) =>
    apiClient
      .post<ApiResponse<ContactMessageDetail>>(`${ADMIN}/${id}/reply`, input, {
        timeout: 45_000,
      })
      .then(unwrap),

  // Reads the contact mailbox (IMAP) and imports new emails. force: skip the 2-minute throttle.
  fetchInbox: (force: boolean) =>
    apiClient
      .post<ApiResponse<ContactInboxFetchResult>>(`${ADMIN}/inbox/fetch`, undefined, {
        params: { force },
        timeout: 60_000,
      })
      .then(unwrap),

  templates: () =>
    apiClient
      .get<ApiResponse<ContactEmailTemplate[]>>(`${ADMIN}/templates`)
      .then(unwrap),

  // Renders the reply exactly as it would be sent, without sending it.
  preview: (id: number, input: ContactReplyInput) =>
    apiClient
      .post<ApiResponse<ContactEmailPreview>>(`${ADMIN}/${id}/reply/preview`, input)
      .then(unwrap),

  setStatus: (id: number, status: ContactStatus) =>
    apiClient
      .put<ApiResponse<ContactMessage>>(`${ADMIN}/${id}/status`, { status })
      .then(unwrap),

  remove: (id: number) =>
    apiClient.delete<ApiResponse<null>>(`${ADMIN}/${id}`).then(unwrap),
};
