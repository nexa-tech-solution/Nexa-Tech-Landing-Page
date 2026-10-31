// Contract of POST /contact (public) and /admin/contact-messages (nexa-be contact module).

export type ContactStatus = "NEW" | "READ" | "REPLIED" | "ARCHIVED";

export type ContactSubmitInput = {
  name: string;
  email: string;
  message: string;
  page?: string; // where the form was sent from
  website?: string; // honeypot: must stay empty
};

export type ContactMessage = {
  id: number;
  name: string;
  email: string;
  message: string;
  sourcePage: string | null;
  status: ContactStatus;
  createdAt: number; // epoch ms
  readAt: number | null;
  repliedAt: number | null;
  lastActivityAt?: number; // newest email or reply in the conversation (absent on older backends)
  tags?: ContactTag[]; // by name (absent on older backends)
};

// A label for sorting the inbox (customer, marketing…). messageCount only in the tag list.
export type ContactTag = {
  id: number;
  name: string;
  color: string; // #rrggbb
  messageCount?: number | null;
};

export type ContactTagInput = { name: string; color: string };

// TEXT: written in the composer and wrapped in the built-in design. HTML: a pasted email, sent as is.
export type ContactReplyFormat = "TEXT" | "HTML";

export type ContactReply = {
  id: number;
  subject: string;
  body: string;
  format?: ContactReplyFormat; // absent on older backends = TEXT
  status: "SENT" | "FAILED";
  error: string | null;
  sentAt: number;
  viaGmail?: boolean; // written in Gmail, picked up from the Sent folder (absent on older backends)
  attachments?: ContactAttachment[]; // files sent with it; only name, type and size are kept
};

export type ContactAttachment = {
  fileName: string;
  contentType: string | null;
  sizeBytes: number | null;
};

// A later email from the sender in the same conversation (answered one of ours).
export type ContactFollowup = {
  id: number;
  body: string;
  receivedAt: number;
};

export type ContactMessageDetail = {
  message: ContactMessage;
  followups?: ContactFollowup[]; // oldest first (absent on older backends)
  replies: ContactReply[]; // oldest first
};

export type ContactListParams = {
  status?: ContactStatus; // none = everything except ARCHIVED
  searchTerm?: string;
  tagId?: number;
  page?: number;
  size?: number;
};

export type ContactEmailTemplateKey =
  | "GENERAL"
  | "RECEIVED"
  | "PROJECT_INQUIRY"
  | "QUOTE"
  | "SUPPORT"
  | "FOLLOW_UP";

// A reply design; subject/body are starting points, {name} = the sender's name.
export type ContactEmailTemplate = {
  key: ContactEmailTemplateKey;
  label: string;
  description: string;
  accent: string;
  subject: string;
  body: string;
  ctaLabel: string | null;
};

export type ContactReplyInput = {
  subject: string;
  body: string;
  format?: ContactReplyFormat; // default TEXT; HTML ignores template and button
  template?: ContactEmailTemplateKey; // default GENERAL
  ctaLabel?: string; // button shown only with both label and url
  ctaUrl?: string; // http(s):// or mailto:
};

export type ContactEmailPreview = { subject: string; html: string; text: string };

// POST /admin/contact-messages/inbox/fetch: emails imported from the contact mailbox.
// fetched=false: answered from the previous fetch (too soon, or one already running).
export type ContactInboxFetchResult = {
  fetched: boolean;
  complete: boolean; // false: stopped at its time limit with more emails left; fetch again
  imported: number;
  skipped: number; // newsletters / notifications, not shown
  replies?: number; // replies written in Gmail added to the reply history (absent on older backends)
  lastFetchedAt: number | null; // epoch ms
};
